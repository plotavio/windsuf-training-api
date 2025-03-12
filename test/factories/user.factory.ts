import { CreateUserDto } from '../../src/user/dto/create-user.dto';

export function createTestUser(index: number): CreateUserDto {
  const baseDate = new Date('1991-01-01');
  baseDate.setDate(baseDate.getDate() + index);

  return {
    name: `Test User ${index}`,
    email: `testuser${index}@example.com`,
    password: 'Test@123',
    citizenId: `citizen${index}`,
    birthdate: baseDate,
  };
}
