import { DataSourceOptions } from 'typeorm';

const ormConfig: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3006,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'TwBGProject',
  database: process.env.DB_NAME || 'blog',
  entities: [__dirname + '/**/*.entity{.js,.ts}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  migrationsRun: true,
  synchronize: false,
};

export default ormConfig;
