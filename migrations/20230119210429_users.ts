import { Knex } from 'knex';

const userTableName = 'users';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(userTableName, (table) => {
    table.uuid('uuid').primary();
    table.bigInteger('createdAt').notNullable();
    table.bigInteger('updatedAt').notNullable();
    table.string('email').notNullable().unique();
    table.string('phone');
    table.string('hashedPassword').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(userTableName);
}
