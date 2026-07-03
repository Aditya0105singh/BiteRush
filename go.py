import os
import shutil
import subprocess
import random
from datetime import datetime, timedelta

# ==========================================
# CONFIGURATION
# ==========================================
SOURCE_DIR = r"d:\1 placement\project\ADITYA VERCEL PORTFOLIO"
GIT_DIR = r"d:\1 placement\project\ADITYA-VERCEL-PORTFOLIO-git"
GITHUB_REMOTE_URL = "https://github.com/Aditya0105singh/ADITYA-VERCEL-PORTFOLIO.git"
AUTHOR_NAME = "Aditya0105singh"
AUTHOR_EMAIL = "aditya@example.com" # Change if needed
START_DATE = datetime(2026, 3, 15, 10, 0, 0)
TOTAL_DAYS = 20

# Set environment variables for Git Author
os.environ["GIT_AUTHOR_NAME"] = AUTHOR_NAME
os.environ["GIT_AUTHOR_EMAIL"] = AUTHOR_EMAIL
os.environ["GIT_COMMITTER_NAME"] = AUTHOR_NAME
os.environ["GIT_COMMITTER_EMAIL"] = AUTHOR_EMAIL

# ==========================================
# HELPER FUNCTIONS
# ==========================================
def run_cmd(cmd, cwd=GIT_DIR):
    result = subprocess.run(cmd, cwd=cwd, shell=True, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Error running command: {cmd}")
        print(result.stderr)
    return result.stdout.strip()

def commit_with_date(message, date_obj):
    date_str = date_obj.strftime("%Y-%m-%dT%H:%M:%S")
    env = os.environ.copy()
    env["GIT_AUTHOR_DATE"] = date_str
    env["GIT_COMMITTER_DATE"] = date_str
    
    cmd = f'git commit -m "{message}"'
    subprocess.run(cmd, cwd=GIT_DIR, shell=True, env=env, capture_output=True)

def copy_file(rel_path):
    src = os.path.join(SOURCE_DIR, rel_path)
    dst = os.path.join(GIT_DIR, rel_path)
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    shutil.copy2(src, dst)

def categorize_files(files):
    scaffold = []
    core = []
    ui = []
    polish = []

    for f in files:
        f_lower = f.lower()
        if any(x in f_lower for x in ['.json', '.md', '.env', '.gitignore', 'config', 'setup']):
            scaffold.append(f)
        elif any(x in f_lower for x in ['.html', '.css', '.scss', '.png', '.jpg', '.svg', 'public', 'assets', 'views', 'components']):
            ui.append(f)
        elif any(x in f_lower for x in ['.js', '.py', '.java', '.ts', 'models', 'controllers', 'routes', 'services']):
            core.append(f)
        else:
            polish.append(f)
            
    # If any category is empty, shift some files around just to balance
    if not scaffold and files: scaffold.append(files.pop(0))
    if not core and files: core.append(files.pop(0))
    if not ui and files: ui.append(files.pop(0))
    
    return scaffold, core, ui, polish

# ==========================================
# MAIN EXECUTION
# ==========================================
def main():
    print(f"[*] Checking Source Directory: {SOURCE_DIR}")
    if not os.path.exists(SOURCE_DIR):
        print(f"[!] Source directory not found. Please verify the path.")
        return

    # 1. Clean and Re-initialize GIT_DIR
    print(f"[*] Setting up Git Directory: {GIT_DIR}")
    if os.path.exists(GIT_DIR):
        # carefully remove existing directory if it exists to start fresh
        # Warning: ensure this path is exclusively for the fake git repo
        try:
            shutil.rmtree(GIT_DIR)
        except Exception as e:
            print(f"[!] Could not remove existing GIT_DIR: {e}")
            return
            
    os.makedirs(GIT_DIR, exist_ok=True)
    run_cmd("git init")
    run_cmd("git branch -M main")

    # Gather files
    all_files = []
    for root, dirs, files in os.walk(SOURCE_DIR):
        # Ignore pycache, node_modules, git in source if any
        if '.git' in root or 'node_modules' in root or '__pycache__' in root:
            continue
        for file in files:
            full_path = os.path.join(root, file)
            all_files.append(os.path.relpath(full_path, SOURCE_DIR))

    scaffold, core, ui, polish = categorize_files(all_files)
    
    print(f"[*] Found {len(all_files)} total files.")
    print(f"    Scaffold: {len(scaffold)}, Core: {len(core)}, UI: {len(ui)}, Polish: {len(polish)}")

    # Time tracking
    current_date = START_DATE

    # Day 1-3: Scaffold
    scaffold_messages = ["chore: project scaffolding", "feat: initial configuration", "docs: update readme", "chore: setup dependencies"]
    # Day 4-9: Core
    core_messages = ["feat: implement core logic", "refactor: optimize data models", "feat: add API endpoints", "fix: resolve routing issue", "feat: integrate database", "chore: boilerplate services"]
    # Day 10-14: UI
    ui_messages = ["feat: design main layout", "style: update color palette", "feat: add sidebar components", "feat: responsive design adjustments", "style: polish frontend assets", "fix: layout bug on mobile"]
    # Day 15-20: Polish & Release
    polish_messages = ["perf: improve load times", "refactor: clean up unused code", "fix: edge case bugs", "chore: final code review tweaks", "feat: prepare for release"]
    empty_messages = ["chore: update comments and cleanup", "docs: minor typo fixes", "style: linting and formatting"]

    def process_phase(file_list, messages, start_day_offset, num_days):
        nonlocal current_date
        if not file_list:
            return
            
        files_per_day = max(1, len(file_list) // num_days)
        file_idx = 0
        
        for day in range(num_days):
            current_date += timedelta(days=1, hours=random.randint(1, 4), minutes=random.randint(0, 59))
            
            daily_files = file_list[file_idx : file_idx + files_per_day]
            file_idx += files_per_day
            
            # If it's the last day of the phase, grab the rest
            if day == num_days - 1 and file_idx < len(file_list):
                daily_files.extend(file_list[file_idx:])
                
            if daily_files:
                for f in daily_files:
                    copy_file(f)
                run_cmd("git add .")
                commit_with_date(random.choice(messages), current_date)
            else:
                # Empty commit for realistic daily activity
                run_cmd("git commit --allow-empty -m '" + random.choice(empty_messages) + "'")
                commit_with_date(random.choice(empty_messages), current_date)

    print("[*] Generating commits...")
    # Process each phase over specific day ranges
    process_phase(scaffold, scaffold_messages, 0, 4)
    process_phase(core, core_messages, 4, 6)
    process_phase(ui, ui_messages, 10, 5)
    process_phase(polish, polish_messages, 15, 5)

    # 7. Add github remote
    print(f"[*] Adding remote: {GITHUB_REMOTE_URL}")
    run_cmd(f"git remote add origin {GITHUB_REMOTE_URL}")

    # 8. Print commit log
    print("[*] Generation complete! Commit log:")
    print("-" * 50)
    log_output = run_cmd("git log --oneline --graph --decorate --all")
    print(log_output)
    print("-" * 50)
    
    print("\n[SUCCESS] The repository has been built.")
    print("To push to GitHub, run:")
    print(f"  cd \"{GIT_DIR}\"")
    print("  git push -u origin main")

if __name__ == "__main__":
    main()
