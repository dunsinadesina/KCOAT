# Documentation for KCOAT Backend, an e-commerce web store specializing in fashion items.

## Author - Adesina Jesudunsin

# INTRODUCTION
This is the documentation for KCOAT backend. You can find the deployed site here "https://kcoat.netlify.app/" and the final project article here "https://www.linkedin.com/posts/jesudunsin-adesina_kcoat-my-journey-in-building-a-fashion-e-commerce-activity-7206620052517703680-txBu?utm_source=share&utm_medium=member_desktop"

## Author's LinkedIn: www.linkedin.com/in/jesudunsin-adesina

# INSTALLATION
To install KCOAT locally, follow these steps:
1. Clone the repository:
   ```
   git clone https://github.com/KCOAT.git
   ```
2. Navigate into the project repository:
  ```
   cd KCOAT
```
3. Install dependencies:
   ```
   npm install
   ```
4. Start your server
   ```
   node app.js
   ```
5. Open postman and run
   ```
   http://localhost:3000
   ```
1. ### User Authentication
   **Scenario**: As a user, I want to register, login, and logout of my account.
   ### Register a new user:

   Endpoint: `POST /register`

   Request Body:
   ```
   {
    "username": "mary_jane",
    "email": "mary.jane@example.com",
    "password": "password123"
   }
Response:
```
{
  "message": "User registered successfully",
  "user": {
    "id": "1",
    "username": "mary_jane",
    "email": "mary.jane@example.com"
  }
}
```
### Login with existing credentials:

Endpoint: `POST /login`

Request Body:
```
{
  "email": "mary.jane@example.com",
  "password": "password123"
}
```
Response:
```
{
  "message": "Login successful",
  "token": "<JWT token>"
}
```
### Logout from current session:

Endpoint: `POST /logout`

Response:
```
{
  "message": "Logout successful"
}
```
2. ### Product Management
   **Scenario**: As an admin, I want to manage products in the catalog.
   ### Add a new product:

  Endpoint: `POST /products`

  Request Body:
  ```
  {
  "productName": "T-Shirt",
  "productPrice": 29.99,
  "productDescription": "Comfortable cotton t-shirt.",
  "productCategory": "Clothing",
  "quantity": 100
}
```
Response:
```
{
  "message": "Product added successfully",
  "product": {
    "id": "1",
    "productName": "T-Shirt",
    "productPrice": 29.99,
    "productDescription": "Comfortable cotton t-shirt.",
    "productCategory": "men",
    "subCategory": "wears",
    "quantity": 100
  }
}
```
### Update an existing product:

Endpoint: `PUT /products/:Productid`

Request Body:
```
{
  "productPrice": 25.99,
  "quantity": 80
}
```
Response:
```
{
  "message": "Product updated successfully",
  "product": {
    "id": "1",
    "productName": "T-Shirt",
    "productPrice": 25.99,
    "productDescription": "Comfortable cotton t-shirt.",
    "productCategory": "men",
    "subCategory": "wears",
    "quantity": 80
  }
}
```
3. ### Shopping Cart Management
**Scenario**: As a customer, I want to manage items in my shopping cart.

### Add a product to the shopping cart:

Endpoint: `POST /cart/:Productid`

Request Body:
```
{
  "productId": "1",
  "quantity": 2
}
```
Response:
```
{
  "message": "Product added to cart successfully",
  "cart": {
    "items": [
      {
        "productId": "1",
        "productName": "T-Shirt",
        "quantity": 2,
        "totalPrice": 51.98
      }
    ],
    "totalItems": 1,
    "totalPrice": 51.98
  }
}
```
### Remove a product from the shopping cart:

Endpoint: `DELETE /cart/:Productid`

Response:
```
{
  "message": "Product removed from cart successfully",
  "cart": {
    "items": [],
    "totalItems": 0,
    "totalPrice": 0
  }
}
```
## Contributing
We welcome contributions to improve KCOAT! To contribute to this project, follow these steps:

1. **Fork the repository**

   Fork the repository to your own GitHub account by clicking on the 'Fork' button.
2. **Clone the repository**

   Clone the forked repository to your local machine and navigate into it.
   ```
   git clone https://github.com/your-username/kcoat.git
   cd kcoat
   ```
3. **Create a new branch**

   Create a new branch for your feature or fix.
   ```
   git checkout -b feature/your-feature-name
   ```
4. **Make changes and test**

   Make your changes and test thoroughly.
5. **Commit your changes**

   Commit your changes with a descriptive commit message.
   ```
   git commit -m 'Add some feature'
   ```
6. **Push to the branch**
   
   Push your changes to your forked repository.
   ```
   git push origin feature/your-feature-name
   ```
7. Submit a pull request

   Go to the GitHub repository and click on the 'Compare & pull request' button for your branch. Fill in a detailed title and description for your pull request.

   Wait for approval

   Wait for your pull request to be reviewed. Make necessary changes if requested.

   Merge the pull request

   Once approved, your pull request will be merged into the main repository.
