import type React from "react"
import { useEffect, useState, useRef } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import api from "../lib/api"
import axios from "axios"
import "../styles/Watch.css"
import Footer from "../components/Footer"
import { FaArrowLeft, FaStepBackward, FaStepForward, FaPlay, FaPause, FaVolumeUp, FaTh } from "react-icons/fa"

interface Segment {
  frame: string
}

interface Orator {
  name: string
  picture: string
  city?: string
  country?: string
}

interface Content {
  id: number
  title: string
  thumbnail?: string
  video_thumbnail_url?: string
  orator_id?: number
  url: string
}

const NO_THUMB =
  "data:image/svg+xml;base64," +
  btoa(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 225">
       <rect width="100%" height="100%" fill="#444"/>
       <text x="50%" y="50%" fill="#ddd" fontSize="20" fontFamily="sans-serif"
             dominantBaseline="middle" textAnchor="middle">No thumb</text>
     </svg>`,
  )

const getTopic = (video: Content) => {
  try {
    const parts = new URL(video.url).pathname.split("/").filter(Boolean)
    return parts.length >= 3 ? decodeURIComponent(parts[1]).replace(/_/g, " ") : ""
  } catch {
    return ""
  }
}

export default function Watch() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string })?.from ?? "/congress"

  const videoRef = useRef<HTMLVideoElement | HTMLAudioElement | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const barRef = useRef<HTMLDivElement>(null)

  const videoMountRef = (el: HTMLVideoElement | HTMLAudioElement | null) => {
    videoRef.current = el
    if (!el) return
    const seekTime = pendingSeekRef.current
    if (seekTime == null) return

    const applySeek = () => {
      el.currentTime = seekTime
      pendingSeekRef.current = null
      setCurrentTime(seekTime)
      setVideoDur(el.duration || 0)
    }

    if (el.readyState >= 1) {
      applySeek()
    } else {
      el.addEventListener("loadedmetadata", applySeek, { once: true })
    }
  }

  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [segments, setSegments] = useState<Segment[]>([])
  const [previews, setPreviews] = useState<Record<string, string>>({})
  const [videoDur, setVideoDur] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)

  const [orator, setOrator] = useState<Orator | null>(null)
  const [related, setRelated] = useState<Content[]>([])

  const [loading, setLoading] = useState(true)
  const [showVid, setShowVid] = useState(false)
  const pendingSeekRef = useRef<number | null>(null)
  const [curIdx, setCurIdx] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(1)

  const [relThumbs, setRelThumbs] = useState<Record<number, string>>({})

  const [hoverTime, setHoverTime] = useState<number | null>(null)
  const [hoverFrame, setHoverFrame] = useState<string | null>(null)
  const [hoverX, setHoverX] = useState<number | null>(null)

  const [showLayout, setShowLayout] = useState(true)
  const hideTimer = useRef<number | null>(null)
  const [hideCursor, setHideCursor] = useState(false)
  const isTouchDevice = useRef(false)

  const [isAudioOnly, setIsAudioOnly] = useState(false)

  const [previewsLoading, setPreviewsLoading] = useState(false)
  const [previewsProgress, setPreviewsProgress] = useState(0)

  const handleMouseActivity = () => {
    setShowLayout(true)
    setHideCursor(false)
    if (hideTimer.current) clearTimeout(hideTimer.current)
    hideTimer.current = window.setTimeout(() => {
      setShowLayout(false)
      setHideCursor(true)
    }, 3000)
  }

  const handleMouseLeaveWrapper = () => {
    setShowLayout(false)
    setHideCursor(false)
    if (hideTimer.current) clearTimeout(hideTimer.current)
  }

  const handleTouchStart = () => {
    isTouchDevice.current = true
    handleMouseActivity()
  }

  const handleVideoClick = () => {
    if (isTouchDevice.current) {
      // On touch: tap toggles controls visibility, not play/pause
      if (showLayout) {
        setShowLayout(false)
        if (hideTimer.current) clearTimeout(hideTimer.current)
      } else {
        handleMouseActivity()
      }
    } else {
      // On desktop: click toggles play/pause
      toggle()
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!videoRef.current || !barRef.current) return

    const { left, width } = barRef.current.getBoundingClientRect()
    const ratio = (e.clientX - left) / width
    const time = ratio * videoRef.current.duration

    setHoverTime(time)
    setHoverX(e.clientX - left)

    const pastSegments = segments.filter((s) => +s.frame / 60 <= time)
    const frame = pastSegments.length > 0 ? pastSegments[pastSegments.length - 1].frame : null
    setHoverFrame(frame)
  }

  const handleMouseLeave = () => {
    setHoverTime(null)
    setHoverFrame(null)
    setHoverX(null)
  }

  const fmtDur = (s: number) => {
    const h = Math.floor(s / 3600),
      m = Math.floor((s % 3600) / 60),
      sec = Math.floor(s % 60)
    return h
      ? `${h}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`
      : `${m}:${sec.toString().padStart(2, "0")}`
  }

  const makeThumb = (video: Content) => {
    const vid = document.createElement("video")
    vid.src = video.url
    vid.crossOrigin = "anonymous"

    vid.addEventListener("loadeddata", () => {
      const target = Math.min(0.5, vid.duration || 0)
      const seek = () =>
        new Promise<void>((res) => {
          const h = () => {
            vid.removeEventListener("seeked", h)
            res()
          }
          vid.addEventListener("seeked", h)
          vid.currentTime = target
        })
      ;(async () => {
        await seek()
        const cvs = document.createElement("canvas")
        cvs.width = vid.videoWidth / 2
        cvs.height = vid.videoHeight / 2
        const ctx = cvs.getContext("2d")!
        ctx.drawImage(vid, 0, 0, cvs.width, cvs.height)
        setRelThumbs((t) => ({ ...t, [video.id]: cvs.toDataURL("image/jpeg", 0.90) }))
      })()
    })
  }

  useEffect(() => {
    if (!videoUrl) return
    let cancelled = false

    const vid = document.createElement("video")
    vid.src = videoUrl
    vid.preload = "metadata"
    vid.crossOrigin = "anonymous"

    const onMeta = () => {
      if (cancelled) return
      setVideoDur(vid.duration || 0)
    }

    vid.addEventListener("loadedmetadata", onMeta)

    return () => {
      cancelled = true
      vid.removeEventListener("loadedmetadata", onMeta)
    }
  }, [videoUrl])

  useEffect(() => {
    const loadVideoData = async () => {
      setLoading(true)
      setPreviews({})

      try {
        const { data: c } = await api.get<Content & { timeStamp?: string }>(`/api/contents/${id}`)
        console.log("VIDEO OBJ", c)

        setVideoUrl(c.url)
        setTitle(c.title.replace(/\.mp4$/i, ""))

        const userId = localStorage.getItem("userId")
        if (userId) {
          try {
            await api.post("/api/history", {
              userId: Number.parseInt(userId, 10),
              contentId: c.id,
              timeStamp: new Date().toISOString(),
            })
            console.log("✅ Ajouté à l'historique")
          } catch (err) {
            console.error("❌ Erreur ajout historique:", err)
          }
        }

        if (c.orator_id) {
          try {
            const { data: o } = await api.get(`/api/orators/${c.orator_id}`)
            setOrator({ name: o.name, picture: o.picture, city: o.city, country: o.country })
          } catch (err) {
            console.warn("❌ Orator fetch fail", err)
          }
        }

        if (c.timeStamp) {
          try {
            const r = await axios.get(c.timeStamp)
            const frames: Array<number> = Array.isArray(r.data)
              ? r.data.map((d: any) => Math.floor(d.start * 60))
              : (() => {
                  const txt = r.data as string
                  const nums = txt.match(/set\s+vide2\s*=\s*\[([\\s\\S]+?)\]/i)?.[1].match(/\d+/g) ?? []
                  return nums.slice(0, -1).map(Number)
                })()
            setSegments(frames.map((f) => ({ frame: f.toString() })))
            setIsAudioOnly(false)
          } catch (e) {
            console.error("❌ Timestamps fetch fail", e)
            setIsAudioOnly(true)
            setShowVid(true)
          }
        } else {
          setIsAudioOnly(true)
          setShowVid(true)
        }

        try {
          const { data: all } = await api.get<Content[]>("/api/contents")
          const same = all.filter((v) => v.orator_id === c.orator_id && v.id !== c.id)
          setRelated(same)
          console.log("RELATED", same)
        } catch (err) {
          console.warn("❌ Related fetch fail", err)
        }
      } catch (err) {
        console.error("❌ Video load fail", err)
      } finally {
        setLoading(false)
      }
    }

    loadVideoData()
  }, [id])

  useEffect(() => {
    if (!videoUrl || segments.length === 0) return
    let cancel = false

    const createPreviews = async () => {
      setPreviewsLoading(true)
      setPreviewsProgress(0)

      const vid = document.createElement("video")
      vid.src = videoUrl
      vid.crossOrigin = "anonymous"
      await new Promise((r) => vid.addEventListener("loadeddata", r, { once: true }))

      const cvs = document.createElement("canvas")
      cvs.width = vid.videoWidth / 2 
      cvs.height = vid.videoHeight / 2
      const ctx = cvs.getContext("2d")!
      const map: Record<string, string> = {}

      for (let i = 0; i < segments.length; i++) {
        const { frame } = segments[i]
        const t = (+frame + 20) / 60

        await new Promise<void>((res) => {
          const h = () => {
            vid.removeEventListener("seeked", h)
            res()
          }
          vid.addEventListener("seeked", h)
          vid.currentTime = t
        })

        ctx.drawImage(vid, 0, 0, cvs.width, cvs.height)
        map[frame] = cvs.toDataURL("image/jpeg", 0.90)

        if (cancel) return

        const progress = ((i + 1) / segments.length) * 100
        setPreviewsProgress(progress)
      }

      if (!cancel) {
        setPreviews(map)
        setPreviewsLoading(false)
      }
    }

    createPreviews()
    return () => {
      cancel = true
    }
  }, [videoUrl, segments])

  useEffect(() => {
    related.forEach((v) => {
      if (!relThumbs[v.id] && !(v.thumbnail || v.video_thumbnail_url)) {
        makeThumb(v)
      }
    })
  }, [related])

  const seekIdx = (i: number) => {
    const t = (+segments[i].frame + 3) / 60
    pendingSeekRef.current = t
    if (videoRef.current && videoRef.current.readyState >= 2) {
      videoRef.current.currentTime = t
      videoRef.current.play().catch(() => {})
    }
    setCurIdx(i)
    setShowVid(true)
  }

  const getCurrentIdx = () => {
    if (!videoRef.current) return -1
    const cf = videoRef.current.currentTime * 60
    let idx = -1
    for (let i = 0; i < segments.length; i++) {
      const start = +segments[i].frame
      const next = segments[i + 1] ? +segments[i + 1].frame : Number.POSITIVE_INFINITY
      if (cf >= start && cf < next) {
        idx = i
        break
      }
    }
    return idx
  }

  const next = () => {
    const i = getCurrentIdx()
    if (i !== -1 && i < segments.length - 1) seekIdx(i + 1)
  }
  const prev = () => {
    const i = getCurrentIdx()
    if (i > 0) seekIdx(i - 1)
  }
  const toggle = () => {
    const el = isAudioOnly ? audioRef.current : videoRef.current
    if (!el) return
    if (el.paused) {
      el.play()
      setIsPlaying(true)
    } else {
      el.pause()
      setIsPlaying(false)
    }
  }
  const toGrid = () => setShowVid(false)

  const clickProgress = (e: React.MouseEvent) => {
    const el = isAudioOnly ? audioRef.current : videoRef.current
    if (!el || !barRef.current) return
    const { left, width } = barRef.current.getBoundingClientRect()
    el.currentTime = ((e.clientX - left) / width) * el.duration
  }

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.volume = volume
  }, [volume])

  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    a.volume = volume
  }, [volume])

  return (
    <>
      <div className="watch-page">
        <header className="watch-topbar glass">
          <button className="back-btn" onClick={() => navigate(from)}>
            <FaArrowLeft />
            <span>Sessions</span>
          </button>

          <motion.h1
            className="session-title neon"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {title}
          </motion.h1>

          <img src={"/logo_transparent.png"} className="watch-logo" onClick={() => navigate("/")} title="Home" />
        </header>

        {loading ? (
          <p className="loading-text">Loading...</p>
        ) : (
          <section className="watch-layout">
            {orator && (
              <aside className="left-pane card">
                <img src={orator.picture || "/public/avatar.png"} className="orator-img" />
                <h3 className="orator-name">{orator.name}</h3>
                <div className="orator-location">
                  {orator.city && orator.country
                    ? `${orator.city}, ${orator.country}`
                    : orator.city || orator.country || "Location not specified"}
                </div>

                <div className="so-one-end">
                  <img src="/SoOne.png" alt="SoOne Logo" className="so-one-logo" />
                  <h3 className="so-one-text">
                    <span className="text-primary">So</span> One
                  </h3>
                </div>
              </aside>
            )}

            <main className="right-pane">
              <AnimatePresence mode="wait">
                {showVid || isAudioOnly ? (
                  <motion.div
                    key="player"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    className={`video-wrapper${hideCursor ? " hide-cursor" : ""}`}
                    onMouseMove={handleMouseActivity}
                    onMouseLeave={handleMouseLeaveWrapper}
                    onTouchStart={handleTouchStart}
                  >
                    {isAudioOnly ? (
                      <div className="audio-placeholder" onClick={handleVideoClick} style={{ cursor: "pointer" }}>
                        <p className="audio-message">No video available for this orator</p>
                        <audio
                          ref={audioRef}
                          src={videoUrl || undefined}
                          preload="metadata"
                          onLoadedMetadata={(e) => setVideoDur(e.currentTarget.duration || 0)}
                          onTimeUpdate={(e) => {
                            const cur = e.currentTarget.currentTime || 0
                            const dur = e.currentTarget.duration || 0
                            setCurrentTime(cur)
                            setVideoDur(dur)
                            if (barRef.current && dur > 0) {
                              barRef.current.style.setProperty("--pct", `${(cur / dur) * 100}%`)
                            }
                          }}
                          onPlay={() => setIsPlaying(true)}
                          onPause={() => setIsPlaying(false)}
                          style={{ display: "none" }}
                        />
                      </div>
                    ) : (
                      <video
                        ref={videoMountRef as any}
                        poster={undefined}
                        playsInline
                        className="video-player glow"
                        onClick={handleVideoClick}
                        onLoadedMetadata={(e) => {
                          setVideoDur(e.currentTarget.duration || 0)
                          e.currentTarget.volume = volume
                        }}
                        onTimeUpdate={(e) => {
                          const cur = e.currentTarget.currentTime || 0
                          const dur = e.currentTarget.duration || 0
                          setCurrentTime(cur)
                          setVideoDur(dur)
                          if (barRef.current && dur > 0) {
                            barRef.current.style.setProperty("--pct", `${(cur / dur) * 100}%`)
                          }
                          const idx = getCurrentIdx()
                          if (idx !== -1) setCurIdx(idx)
                        }}
                        onSeeked={(e) => {
                          const cur = e.currentTarget.currentTime || 0
                          const dur = e.currentTarget.duration || 0
                          setCurrentTime(cur)
                          setVideoDur(dur)
                          if (barRef.current && dur > 0) {
                            barRef.current.style.setProperty("--pct", `${(cur / dur) * 100}%`)
                          }
                          const idx = getCurrentIdx()
                          if (idx !== -1) setCurIdx(idx)
                        }}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                      >
                        <source src={videoUrl!} type="video/mp4" />
                      </video>
                    )}

                    <div className="video-overlay" style={{ opacity: showLayout ? 1 : 0, transition: "opacity 0.3s" }}>
                      <div className="overlay-top">
                        {!isAudioOnly && segments.length > 0 && (
                          <div className="slide-counter">
                            Slide {curIdx + 1}/{segments.length}
                          </div>
                        )}
                      </div>

                      <div className="overlay-bottom">
                        <div className="progress-container">
                          <div
                            className="progress-bar"
                            ref={barRef}
                            onClick={clickProgress}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                          >
                            <div className="progress-fill" />
                          </div>
                          {!isAudioOnly && hoverTime != null && (
                            <div className="preview-tooltip" style={{ left: hoverX ?? 0 }}>
                              {hoverFrame && previews[hoverFrame] ? (
                                <img
                                  src={previews[hoverFrame] || "/placeholder.svg"}
                                  alt="preview"
                                  className="preview-img"
                                />
                              ) : (
                                <div className="preview-placeholder" />
                              )}
                              <div className="preview-time">{hoverTime ? fmtDur(hoverTime) : ""}</div>
                            </div>
                          )}
                        </div>

                        <div className="controls-row">
                          <div className="left-controls">
                            {!isAudioOnly && (
                              <button className="overlay-ctrl" onClick={prev} disabled={curIdx <= 0}>
                                <FaStepBackward />
                              </button>
                            )}
                            <button className="overlay-ctrl play-pause-btn" onClick={toggle}>
                              {isPlaying ? <FaPause /> : <FaPlay />}
                            </button>
                            {!isAudioOnly && (
                              <button className="overlay-ctrl" onClick={next} disabled={curIdx >= segments.length - 1}>
                                <FaStepForward />
                              </button>
                            )}
                            <div className="time-display">
                              {fmtDur(currentTime)} / {fmtDur(videoDur)}
                            </div>
                          </div>

                          <div className="right-controls">
                            <div className="volume-container">
                              <FaVolumeUp style={{ color: "white", fontSize: "1.1rem" }} />
                              <input
                                type="range"
                                className="volume-overlay"
                                min="0"
                                max="1"
                                step="0.05"
                                value={volume}
                                onChange={(e) => {
                                  const v = +e.target.value
                                  setVolume(v)
                                  if (videoRef.current) videoRef.current.volume = v
                                  if (audioRef.current) audioRef.current.volume = v
                                }}
                              />
                            </div>
                            {!isAudioOnly && segments.length > 0 && (
                              <button className="overlay-ctrl" onClick={toGrid}>
                                <FaTh />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="grid"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.25 }}
                  >
                    <h3 className="neon sub">Choose a slide</h3>

                    {previewsLoading ? (
                      <div className="previews-loading-container">
                        <motion.div
                          className="loading-dots"
                          style={{ display: "flex", gap: "8px", justifyContent: "center", alignItems: "center" }}
                        >
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              style={{
                                width: "12px",
                                height: "12px",
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, #ff4d4d, #550000)",
                              }}
                              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 1.4, delay: i * 0.2, repeat: Number.POSITIVE_INFINITY }}
                            />
                          ))}
                        </motion.div>

                        <motion.p
                          className="loading-text neon"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          Generating slide previews...
                        </motion.p>

                        <div className="progress-bar-container">
                          <div className="progress-bar-bg">
                            <motion.div
                              className="progress-bar-fill"
                              initial={{ width: 0 }}
                              animate={{ width: `${previewsProgress}%` }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                          <p className="progress-percentage">{Math.round(previewsProgress)}%</p>
                        </div>
                      </div>
                    ) : (
                      <ul className="frame-grid">
                        {segments.map(({ frame }, i) => (
                          <li
                            key={frame}
                            className={`thumb-wrapper ${i === curIdx ? "active" : ""}`}
                            onClick={() => seekIdx(i)}
                          >
                            {previews[frame] ? (
                              <motion.img
                                src={previews[frame] || "/placeholder.svg"}
                                className="thumb"
                                alt="thumbnail"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.02 }}
                              />
                            ) : (
                              <div className="placeholder" />
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </main>

            {!loading && (
              <div className="video-info-bar">
                {orator && (
                  <p>
                    <strong>{title}</strong>
                  </p>
                )}
              </div>
            )}

            <section className="suggestions">
              <h3 className="neon sub">Other videos by this speaker</h3>

              {related.length === 0 ? (
                <p className="loading-text">No other videos for this speaker.</p>
              ) : (
                <div className="suggestion-row">
                  {related.map((v, i) => (
                    <motion.div
                      key={v.id}
                      className="suggest-card"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => navigate(`/watch/${v.id}`, { state: { from } })}
                    >
                      <img src={relThumbs[v.id] || v.thumbnail || v.video_thumbnail_url || NO_THUMB} alt={v.title} />
                      <p className="title">{v.title}</p>
                      <p className="topic">{getTopic(v)}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </section>
          </section>
        )}
      </div>
      <Footer />
    </>
  )
}
