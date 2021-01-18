import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilService {
  generateRandomString(
    length = 8,
    factory = 'abcdefghijklmnopqrstuvwxyz1234567890',
  ): string {
    let generated = '';

    for (let i = 0; i < length; i += 1) {
      const char = factory[Math.floor(Math.random() * factory.length)];
      generated += Math.random() > 0.5 ? char : char.toUpperCase();
    }

    return generated;
  }
}
