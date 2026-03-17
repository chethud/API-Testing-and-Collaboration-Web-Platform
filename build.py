"""Build script for Vercel: install frontend deps, build React app, copy to public/."""
import os
import subprocess
import shutil

def main():
    root = os.path.dirname(os.path.abspath(__file__))
    frontend = os.path.join(root, "frontend")
    public = os.path.join(root, "public")
    dist = os.path.join(frontend, "dist")

    os.chdir(frontend)
    subprocess.run(["npm", "install"], check=True)
    subprocess.run(["npm", "run", "build"], check=True)
    os.chdir(root)

    if os.path.exists(public):
        shutil.rmtree(public)
    shutil.copytree(dist, public)
    print("Frontend built and copied to public/")

if __name__ == "__main__":
    main()
