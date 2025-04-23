
export function globalSetup() {
    console.log(`🚀 Running tests in ${process.env.RUN_ENV === 'docker' ? 'Docker container 🐳' : 'local environment 💻'} `);
}

export default globalSetup;
  