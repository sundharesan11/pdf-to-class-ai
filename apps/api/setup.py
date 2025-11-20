from setuptools import setup, find_packages

setup(
    name="eduagent-api",
    version="0.0.1",
    description="Python backend for EduAgent platform with OpenAI Agents SDK",
    packages=find_packages(where="src"),
    package_dir={"": "src"},
    python_requires=">=3.11",
)
