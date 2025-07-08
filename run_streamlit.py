import subprocess
import sys
import os

def run_streamlit():
    """Run the Streamlit app"""
    try:
        # Change to the directory containing the Streamlit app
        os.chdir(os.path.dirname(os.path.abspath(__file__)))
        
        # Run Streamlit app
        subprocess.run([
            sys.executable, "-m", "streamlit", "run", "streamlit_app.py",
            "--server.port", "8501",
            "--server.address", "localhost",
            "--server.headless", "true",
            "--browser.gatherUsageStats", "false"
        ])
    except KeyboardInterrupt:
        print("\nStreamlit app stopped.")
    except Exception as e:
        print(f"Error running Streamlit app: {e}")

if __name__ == "__main__":
    run_streamlit() 