import container from "./container/index.js";
import { Container } from "./container/index.js";
import Injectable from "./injectable/index.js";
import Singleton from "./singleton/index.js";
import value from "./value/index.js";
import {
    ServerlessContainer,
    createServerlessContainer,
    ServerlessInjectable,
} from "./containerV2/index.js";
import { colors } from "./utils/index.js";

export {
    container,
    Injectable,
    Singleton,
    value,
    Container,
    ServerlessContainer,
    createServerlessContainer,
    ServerlessInjectable,
};

console.log(`
${colors.cyan}🌟 Thank you for using Elea-DI! 🎉${colors.reset}

${colors.green}We appreciate your support and welcome any contributions or feedback about the Elea-DI Framework.
Feel free to open issues or pull requests on GitHub!${colors.reset}

👉 ${colors.blue}GitHub Repository: https://github.com/DDuran19/elea-di${colors.reset}
`);
