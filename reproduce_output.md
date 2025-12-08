Attempting to create project...
Failed: (pymysql.err.OperationalError) (1054, "Unknown column 'manpower_cost' in 'INSERT INTO'")
[SQL: INSERT INTO projects (name, description, customer, start_date, end_date, status, stage, priority, manpower_cost, equipment_cost, material_cost, additional_cost) VALUES (%(name)s, %(description)s, %(customer)s, %(start_date)s, %(end_date)s, %(status)s, %(stage)s, %(priority)s, %(manpower_cost)s, %(equipment_cost)s, %(material_cost)s, %(additional_cost)s)]
[parameters: {'name': 'Test Project', 'description': None, 'customer': None, 'start_date': None, 'end_date': None, 'status': None, 'stage': 'Planning', 'priority': None, 'manpower_cost': 0.0, 'equipment_cost': 0.0, 'material_cost': 0.0, 'additional_cost': 0.0}]
(Background on this error at: https://sqlalche.me/e/20/e3q8)
