import { MigrationInterface, QueryRunner, Table } from 'typeorm';

class CreateAppointments1621088993704 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'appointments',
				columns: [
					{
						name: 'id',
						type: 'varchar',
						isPrimary: true,
						generationStrategy: 'uuid',
					},
				],
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {}
}

// export default CreateAppointments1621088993704;
