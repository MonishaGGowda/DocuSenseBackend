exit()
import os

db_path = "db.sqlite3"
print(os.path.abspath(db_path))
subprocess.run(["chmod", "777", db_path])

if os.path.exists(db_path):
    os.remove(db_path)
    print("db.sqlite3 has been deleted.")
else:
    print("db.sqlite3 file does not exist.")

print("Running migrations...")
subprocess.run(["python3", "manage.py", "migrate"])
subprocess.run(["python3", "manage.py", "createsuperuser"])