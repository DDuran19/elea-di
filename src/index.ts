import container from "./container/index.js";
import { Container } from "./container/index.js";
import Injectable from "./injectable/index.js";
import Singleton from "./singleton/index.js";
import value from "./value/index.js";

export { container, Injectable, Singleton, value, Container };

const colors = {
    reset: "\x1b[0m",
    bold: "\x1b[1m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
};

console.log(`
${colors.cyan}🌟 Thank you for using Elea-DI! 🎉${colors.reset}

${colors.green}We appreciate your support and welcome any contributions or feedback about the Elea-DI Framework.
Feel free to open issues or pull requests on GitHub!${colors.reset}

👉 ${colors.blue}GitHub Repository: https://github.com/DDuran19/elea-di${colors.reset}
`);
