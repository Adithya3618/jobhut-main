# JobHut 🎯

![JobHut Banner](public/LOGO.jpg)

JobHut is a modern job aggregation platform that brings together opportunities from multiple job boards and company websites into one seamless interface. Built with Next.js, it helps job seekers save time by eliminating the need to search across multiple websites.

## ✨ Features

- **Job Aggregation**: Automatically collects jobs from multiple sources
- **Smart Search**: Advanced filtering and search capabilities
- **Real-time Updates**: Fresh job listings added daily
- **User Profiles**: Save preferences and track applications
- **Mobile Responsive**: Seamless experience across all devices
- **Easy Apply**: Apply to multiple jobs with saved information

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn package manager
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Adithya3618/jobhut-main.git
cd jobhut-main
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add necessary environment variables:
```env
NEXT_PUBLIC_API_URL=your_api_url
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas/database)
- **Authentication**: [JWT]
- **Deployment**: [Vercel](https://vercel.com)

## 📂 Project Structure

```
jobhut/
├── app/
│   ├── page.js
│   ├── layout.js
│   └── ...
├── components/
│   ├── Header/
│   ├── Footer/
│   └── ...
├── public/
│   └── ...
├── styles/
│   └── globals.css
└── ...
```

## 🔑 Key Features in Detail

### Job Aggregation Engine
- Collects jobs from multiple sources
- Removes duplicates
- Standardizes job descriptions
- Updates listings automatically

### Search & Filter
- Advanced search algorithms
- Multiple filter options
- Saved search preferences
- Real-time results

### User Features
- Profile creation
- Application tracking
- Job alerts
- Resume upload

## 📱 Screenshots

![Homepage](public/screenshot1.png)
*Homepage with job listings*

![Search](public/screenshot2.png)
*Advanced search interface*

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🧩 Setup and Troubleshooting

- Environment variables (create .env):
  - MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
  - JWT_SECRET=<your secret>
  - Optional: JOOBLE_API_KEY=<your key>
- Seed configs and admin (optional):
  - node insertJoobleConfig.js
  - node insertAdmin.js
- Test MongoDB connectivity:
  - node testConnection.js
- Troubleshooting:
  - MongoDB SSL/TLS errors (tlsv1 alert internal error): ensure your IP is allowed in Atlas Network Access, disable HTTPS scanning/proxy or try a different network, verify system clock, and use the SRV URI.
  - Jooble: response fields are title, company, location, snippet, type, link. The UI maps link to Apply Link and strips HTML from snippet.
  - CoreSignal 401/402: indicates unauthorized or insufficient credits; verify API key and plan.

## 🚀 Deployment

The easiest way to deploy JobHut is to use the [Vercel Platform](https://vercel.com):

1. Push your code to GitHub
2. Import your repository to Vercel
3. Add necessary environment variables
4. Deploy!

## 🌟 Acknowledgments

- All the job boards that make this aggregation possible
- The Next.js team for an amazing framework
- Our contributors and supporters

## 📞 Support

For support, email jobhut.team@gmail.com or join our [Discord community](discord-link).

---

Built with ❤️ by [Vecha Sai Badarinadh]