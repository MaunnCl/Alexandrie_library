import { UsersService } from '../../src/services/users.service';
import { UsersRepository } from '../../src/repository/user.repository';

jest.mock('../../src/repository/user.repository');

describe('UsersService', () => {
  const userMock = {
    id: 1,
    firstname: 'John',
    lastname: 'Doe',
    email: 'john.doe@example.com',
    password: 'hashedpassword',
    address: '123 Main St',
    country: 'France',
    zipcode: '75000',
    phone: '0102030405',
    dateOfBirth: '2000-01-01',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a user', async () => {
    (UsersRepository.create as jest.Mock).mockResolvedValue(userMock);

    const result = await UsersService.create(userMock);
    expect(result).toEqual(userMock);
    expect(UsersRepository.create).toHaveBeenCalledWith(userMock);
  });

  it('should get all users', async () => {
    (UsersRepository.findAll as jest.Mock).mockResolvedValue([userMock]);

    const result = await UsersService.getAll();
    expect(result).toEqual([userMock]);
  });

  it('should get user by id', async () => {
    (UsersRepository.findById as jest.Mock).mockResolvedValue(userMock);

    const result = await UsersService.getById(1);
    expect(result).toEqual(userMock);
  });

  it('should update user by id', async () => {
    const updateData = { firstname: 'Jane' };
    const updatedUser = { ...userMock, ...updateData };
    (UsersRepository.update as jest.Mock).mockResolvedValue(updatedUser);

    const result = await UsersService.update(1, updateData);
    expect(result).toEqual(updatedUser);
  });

  it('should delete user by id', async () => {
    (UsersRepository.delete as jest.Mock).mockResolvedValue(userMock);

    const result = await UsersService.delete(1);
    expect(result).toEqual(userMock);
  });

  it('should find user by email', async () => {
    (UsersRepository.findByEmail as jest.Mock).mockResolvedValue(userMock);

    const result = await UsersService.findByEmail('john.doe@example.com');
    expect(result).toEqual(userMock);
  });
});