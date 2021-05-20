import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

class AlterTypeOfFieldsToUuidInTablesAppointmentsAndUsers1621439100528
implements MigrationInterface
{
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.changeColumn(
			'appointments',
			'id',
			new TableColumn({
				name: 'id',
				type: 'uuid',
				isPrimary: true,
				generationStrategy: 'uuid',
				default: 'uuid_generate_v4()',
			}),
		);

		await queryRunner.changeColumn(
			'appointments',
			'provider',
			new TableColumn({
				name: 'provider',
				type: 'uuid',
				isNullable: false,
			}),
		);

		await queryRunner.changeColumn(
			'users',
			'id',
			new TableColumn({
				name: 'id',
				type: 'uuid',
				isPrimary: true,
				generationStrategy: 'uuid',
				default: 'uuid_generate_v4()',
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.changeColumn(
			'appointments',
			'id',
			new TableColumn({
				name: 'id',
				type: 'varchar',
				isPrimary: true,
				generationStrategy: 'uuid',
				default: 'uuid_generate_v4()',
			}),
		);

		await queryRunner.changeColumn(
			'appointments',
			'provider',
			new TableColumn({
				name: 'provider',
				type: 'varchar',
				isNullable: false,
			}),
		);

		await queryRunner.changeColumn(
			'users',
			'id',
			new TableColumn({
				name: 'id',
				type: 'varchar',
				isPrimary: true,
				generationStrategy: 'uuid',
				default: 'uuid_generate_v4()',
			}),
		);
	}
}

export default AlterTypeOfFieldsToUuidInTablesAppointmentsAndUsers1621439100528;
