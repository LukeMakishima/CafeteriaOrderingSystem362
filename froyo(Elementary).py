import tkinter as tk
from tkinter import messagebox

# Define the menu
menu = {
    "flavors": {
        "vanilla": 3.00,
        "chocolate": 3.50,
        "strawberry": 4.00,
        "mango": 4.50,
    },
    "toppings": {
        "sprinkles": 0.50,
        "chocolate chips": 1.00,
        "fruit": 1.50,
        "nuts": 1.00,
    },
    "sizes": {
        "small": 0.00,
        "medium": 1.00,
        "large": 2.00,
    }
}

# User credentials (for demonstration)
users = {
    "user1": "password1",
    "user2": "password2"
}

# Global variables
current_user = None
cart = []

# Function to handle login
def login():
    global current_user
    username = username_entry.get()
    password = password_entry.get()

    if username in users and users[username] == password:
        current_user = username
        login_window.destroy()
        open_order_window()
    else:
        messagebox.showerror("Login Failed", "Invalid username or password")

# Function to handle registration
def register():
    username = register_username_entry.get()
    password = register_password_entry.get()

    if username in users:
        messagebox.showerror("Registration Failed", "Username already exists.")
    else:
        users[username] = password
        messagebox.showinfo("Registration Successful", "Account created successfully!")
        register_window.destroy()

# Function to open the registration window
def open_register_window():
    global register_window, register_username_entry, register_password_entry
    register_window = tk.Toplevel()
    register_window.title("Register")
    register_window.geometry("300x200")

    register_username_label = tk.Label(register_window, text="Username:")
    register_username_label.pack(pady=5)
    register_username_entry = tk.Entry(register_window)
    register_username_entry.pack(pady=5)

    register_password_label = tk.Label(register_window, text="Password:")
    register_password_label.pack(pady=5)
    register_password_entry = tk.Entry(register_window, show="*")
    register_password_entry.pack(pady=5)

    register_button = tk.Button(register_window, text="Register", command=register)
    register_button.pack(pady=20)

# Function to open the ordering window
def open_order_window():
    order_window = tk.Toplevel()
    order_window.title("Frozen Yogurt Ordering System")
    order_window.geometry("400x500")

    # Variables to store user selections
    flavor_var = tk.StringVar(value="vanilla")
    toppings_vars = {
        "sprinkles": tk.BooleanVar(),
        "chocolate chips": tk.BooleanVar(),
        "fruit": tk.BooleanVar(),
        "nuts": tk.BooleanVar(),
    }
    size_var = tk.StringVar(value="small")

    # Function to add item to cart
    def add_to_cart():
        item = {
            "flavor": flavor_var.get(),
            "toppings": [topping for topping, var in toppings_vars.items() if var.get()],
            "size": size_var.get(),
        }
        cart.append(item)
        messagebox.showinfo("Added to Cart", "Item added to cart!")

    # Function to view cart
    def view_cart():
        if not cart:
            messagebox.showinfo("Cart", "Your cart is empty.")
            return

        cart_summary = "Your Cart:\n"
        total = 0.0
        for i, item in enumerate(cart, 1):
            flavor = item["flavor"]
            toppings = item["toppings"]
            size = item["size"]

            # Calculate item price
            price = menu["flavors"][flavor]
            for topping in toppings:
                price += menu["toppings"][topping]
            price += menu["sizes"][size]

            cart_summary += f"{i}. {flavor.capitalize()} with {', '.join(toppings)} ({size.capitalize()}) - ${price:.2f}\n"
            total += price

        cart_summary += f"\nTotal: ${total:.2f}"
        messagebox.showinfo("Cart Summary", cart_summary)

    # Function to checkout
    def checkout():
        if not cart:
            messagebox.showinfo("Checkout", "Your cart is empty.")
            return

        # Display final order summary
        order_summary = "Thank you for your order!\n\n"
        order_summary += f"Customer: {current_user}\n"
        order_summary += "Your Order:\n"
        total = 0.0
        for i, item in enumerate(cart, 1):
            flavor = item["flavor"]
            toppings = item["toppings"]
            size = item["size"]

            # Calculate item price
            price = menu["flavors"][flavor]
            for topping in toppings:
                price += menu["toppings"][topping]
            price += menu["sizes"][size]

            order_summary += f"{i}. {flavor.capitalize()} with {', '.join(toppings)} ({size.capitalize()}) - ${price:.2f}\n"
            total += price

        order_summary += f"\nTotal: ${total:.2f}"
        messagebox.showinfo("Order Confirmation", order_summary)

        # Clear the cart
        cart.clear()

    # Create UI elements for ordering
    flavor_label = tk.Label(order_window, text="Choose a flavor:")
    flavor_label.pack()
    for flavor, price in menu["flavors"].items():
        tk.Radiobutton(order_window, text=f"{flavor.capitalize()} (${price:.2f})", variable=flavor_var, value=flavor).pack()

    toppings_label = tk.Label(order_window, text="Choose toppings:")
    toppings_label.pack()
    for topping, price in menu["toppings"].items():
        tk.Checkbutton(order_window, text=f"{topping.capitalize()} (${price:.2f})", variable=toppings_vars[topping]).pack()

    size_label = tk.Label(order_window, text="Choose a size:")
    size_label.pack()
    for size, price in menu["sizes"].items():
        if size == "small":
            tk.Radiobutton(order_window, text=f"{size.capitalize()} (${price:.2f})", variable=size_var, value=size).pack()
        else:
            tk.Radiobutton(order_window, text=f"{size.capitalize()} (+${price:.2f})", variable=size_var, value=size).pack()

    add_to_cart_button = tk.Button(order_window, text="Add to Cart", command=add_to_cart)
    add_to_cart_button.pack(pady=10)

    view_cart_button = tk.Button(order_window, text="View Cart", command=view_cart)
    view_cart_button.pack(pady=10)

    checkout_button = tk.Button(order_window, text="Checkout", command=checkout)
    checkout_button.pack(pady=10)

# Create login window
login_window = tk.Tk()
login_window.title("Login")
login_window.geometry("300x200")

# Login UI elements
username_label = tk.Label(login_window, text="Username:")
username_label.pack(pady=5)
username_entry = tk.Entry(login_window)
username_entry.pack(pady=5)

password_label = tk.Label(login_window, text="Password:")
password_label.pack(pady=5)
password_entry = tk.Entry(login_window, show="*")
password_entry.pack(pady=5)

login_button = tk.Button(login_window, text="Login", command=login)
login_button.pack(pady=10)

register_button = tk.Button(login_window, text="Register", command=open_register_window)
register_button.pack(pady=10)

# Run the application
login_window.mainloop()