# Elea Inversion of Control (IoC) Dependency Injection Library

**Elea** is a lightweight Inversion of Control (IoC) and Dependency Injection (DI) library, written in TypeScript, with zero external dependencies. It's designed to be minimal and easy to integrate into your TypeScript or JavaScript projects.

## Features
- Zero external dependencies ( Works on Serverless!)
- Strong type-safety
- Simple IoC container for managing class dependencies
- Recursive dependency resolution
- Singleton pattern support
- Lightweight and extendable

## Installation

You can install **Elea Dependency Injection** via npm:

```bash
npm install elea-di
```

Or with Yarn:

```bash
yarn add elea-di
```

## Getting Started

1. Define your classes that extend the `Injectable` base class.
2. Register your classes with the `container`.
3. Resolve dependencies through the `container.resolve()` method.

### Example

```ts
import { Injectable, container, value } from 'elea-di';

// Example of a service that requires dependencies
class DatabaseService extends Injectable {
    // Class implementation
}

class AuthenticationService extends Injectable {
    // Class implementation
}

class LoggingService extends Injectable {
    static _dependencies = [DatabaseService, AuthenticationService];
    
    constructor(db: DatabaseService, auth: AuthenticationService) {
        // LoggingService implementation
    }
}

// Register the classes in the container
container.register(DatabaseService)
         .register(AuthenticationService)
         .register(LoggingService);

// Resolve and use the LoggingService
const loggingService = container.resolve(LoggingService);

// Using the Value class to wrap a value. NO NEED to register!
const connectionString = value("db://localhost:27017");

```

In this example:
- `LoggingService` depends on `DatabaseService` and `AuthenticationService`.
- The `container.register()` method registers the dependencies.
- The `container.resolve()` method resolves and injects the necessary dependencies.
- The value() function is used to register and retrieve simple values.

## Documentation

### `Injectable` Class
Every class that should be managed by the container must extend the `Injectable` base class. Dependencies are declared using a static `_dependencies` array, with the order matching the constructor parameters.

```ts
class MyService extends Injectable {
    static _dependencies = [OtherService];
    
    constructor(otherService: OtherService) {
        // Constructor implementation
    }
}
```

### `container` Object
The `container` manages the registration and resolution of dependencies.

- **`register(injectable: Injectable)`**: Registers a class in the container.
- **`resolve<T>(injectable: Injectable)`**: Resolves a class and its dependencies.

### `Value` Class
The `Value` class allows you to wrap a value so it can be managed by the container. This is useful for managing simple values as injectable dependencies.

```ts
const apiUrl = value("https://api.example.com");
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contributing
Contributions are welcome! Please feel free to open an issue or submit a pull request on the GitHub repository.

## Links

- [NPM Package](https://www.npmjs.com/package/elea-di)
- [GitHub Repository](https://github.com/DDuran19/elea-di)
