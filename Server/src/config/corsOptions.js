const whitelist = [
    'https://game-vault-pl147lw76-nitigya-chandels-projects.vercel.app/',
    'http://127.0.0.1:5500',
    'http://localhost:5173'
];

const corsOptions = {
    origin: (origin, callback) => {
        console.log(origin);
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials:true,
    optionsSuccessStatus: 200
}

module.exports = corsOptions;