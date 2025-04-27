class RouteInterface {
  constructor() {
    if (this.constructor === RouteInterface) {
      throw new Error(
        "RouteInterface is an abstract class and cannot be instantiated directly."
      );
    }
    this.routes = [];
  }

  // Method for adding a route
  addRoute(route) {
    this.routes.push(route);
  }

  // Method for getting all routes
  getRoutes() {
    return this.routes;
  }

  // Method for initializing routes
  initializeRoutes() {
    throw new Error("Method 'initializeRoutes' must be implemented.");
  }
}

module.exports = RouteInterface;
