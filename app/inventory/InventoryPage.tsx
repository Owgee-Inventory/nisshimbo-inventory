"use client";
import { useState } from "react";

const inventoryItems = [
  {
    sku: "BRK-1048",
    name: "Ceramic Brake Pads",
    category: "Brake System",
    stock: 120,
    minStock: 30,
    price: 42.5,
  },
  {
    sku: "FLT-2201",
    name: "Oil Filter",
    category: "Filters",
    stock: 18,
    minStock: 25,
    price: 9.75,
  },
  {
    sku: "SPK-8052",
    name: "Iridium Spark Plug",
    category: "Ignition",
    stock: 184,
    minStock: 40,
    price: 13.4,
  },
];

export default function InventoryPage() {
  const [items, setItems] = useState(inventoryItems);
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();
  const filteredItems = items.filter((item) =>
    [item.name, item.sku, item.category].some((value) =>
      value.toLowerCase().includes(query)
    )
  );

  return (
    <section className="inventoryPanel">
      <h3>Inventory Items</h3>
      <label>
        Search Inventory{" "}
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Name, SKU, or Category"
        ></input>
      </label>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const form = event.currentTarget;
          const data = new FormData(form);
          const newItem = {
            sku: String(data.get("sku")).trim().toUpperCase(),
            name: String(data.get("name")).trim(),
            category: String(data.get("category")).trim(),
            stock: Number(data.get("stock")),
            minStock: Number(data.get("minStock")),
            price: Number(data.get("price")),
          };
          if (!newItem.sku || !newItem.name || !newItem.category) {
            alert("Enter complete details");
            return;
          }
          if (items.some((item) => item.sku === newItem.sku)) {
            alert("That SKU already exists");
            return;
          }
          setItems((previousItems) => [...previousItems, newItem]);
          setSearch("");
          form.reset();
        }}
      >
        <label>
          Item name <input name="name" required />
        </label>
        <label>
          SKU <input name="sku" required />
        </label>
        <label>
          Category <input name="category" required />
        </label>
        <label>
          Stock <input name="stock" type="number" min="0" required />
        </label>
        <label>
          Minimum stock <input name="minStock" type="number" min="0" required />
        </label>
        <label>
          Unit price{" "}
          <input name="price" type="number" min="0" step="0.01" required />
        </label>
        <button type="submit">Add item</button>
      </form>
      <div className="inventoryTableScroll">
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Minimum</th>
              <th>Unit Price</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item.sku}>
                <td>{item.name}</td>
                <td>{item.sku}</td>
                <td>{item.category}</td>
                <td className={item.stock <= item.minStock ? "lowStock" : ""}>
                  {item.stock}
                </td>
                <td>{item.minStock}</td>
                <td>PHP{item.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
