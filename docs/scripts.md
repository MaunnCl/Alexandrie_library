# Backend Utility Scripts

This document explains the purpose and usage of the Node.js/TypeScript scripts located in `Backend/utils/scripts`. These small utilities interact with the backend API and AWS S3 bucket to keep data in sync or populate the database for testing.

All files reside in `Backend/utils/scripts`.

The folder contains both `.ts` sources and the transpiled `.js` versions. You can run the TypeScript files with `ts-node`/`tsx` or the plain JavaScript with `node`.

## checkMissingVideos

*Files*: `checkMissingVideos.ts`, `checkMissingVideos.js`

Checks that every video referenced in the database actually exists in the S3 bucket and vice‑versa.
It lists missing videos on S3 as well as orphan videos stored on S3 but not registered in the DB.
Run it whenever you suspect inconsistencies between storage and the DB.

## create_content

*File*: `create_content.js`

Populates the `contents` table by sending POST requests to the running backend API.
The list of contents is hard coded in the script and can be adjusted before running.
Useful for quickly seeding the database in development.

## create_orators

*File*: `create_orators.js`

Creates orator entries via POST requests. Similar to `create_content`, the data is predefined inside the script.
Run this to add a demo set of orators for testing.

## syncContentForOrators

*Files*: `syncContentForOrators.ts`, `syncContentForOrators.js`

Updates each orator record with the list of associated content IDs.
It fetches all orators, retrieves contents for each, merges existing IDs, and stores the result back to the database.
The TypeScript version only exports the function—call it from another script or REPL as needed.

## syncOratorsPhotos

*Files*: `syncOratorsPhotos.utils.ts`, `syncOratorsPhotos.utils.js`

Looks for JPEG photos of orators in the S3 bucket under `orators/` and updates each orator record with a presigned URL to the matching file.
If no photo is found for an orator the script logs a warning.

## syncTimeStamp

*Files*: `syncTimeStamp.ts`, `syncTimeStamp.js`

For every piece of content, searches S3 for timestamp files with `.txt` or `.json` extensions.
When a file is found, the script generates a presigned URL and stores it in the `timeStamp` field of the content record.

## syncVideo

*Files*: `syncVideo.utils.ts`, `syncVideo.utils.js`

Finds `.mp4` files in S3 corresponding to each content entry and updates the database with a presigned video URL. Missing videos are reported in the console.

## update_orators_with_contents

*File*: `update_orators_with_contents..js`

Fetches every content record, groups them by `orator_id`, and updates each orator via the API to include the corresponding `content_ids` array. Meant for batch updating after migrating data.

---

### Note on an `assemble` script

The repository currently does not contain a utility named `assemble`. If such a script is added later it would likely be responsible for merging or processing files (for example assembling video segments). Ensure you understand the accepted input types before running it, as some tools only work with specific formats.