const { test, expect } = require("@playwright/test");
const { createHash, randomUUID } = require("node:crypto");
const {
  createShopFixture,
  cleanupShopFixture,
  backendUrl,
} = require("../helpers/shop-fixture.cjs");
let fixture;
let pageErrors = [];
test.beforeAll(async ({ playwright }) => {
  fixture = await createShopFixture(playwright);
});
test.afterAll(async () => {
  await cleanupShopFixture(fixture);
});
test.beforeEach(async ({ page }) => {
  pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  expect((await fixture.customer.api.delete("/cart")).status()).toBe(200);
  expect(
    (
      await fixture.admin.api.patch(`/products/${fixture.washer.productID}`, {
        data: { price: 1234.5, isActive: true },
      })
    ).status(),
  ).toBe(200);
  expect(
    (
      await fixture.admin.api.patch(
        `/products/${fixture.washer.productID}/stock`,
        { data: { stockQty: 3 } },
      )
    ).status(),
  ).toBe(200);
});
test.afterEach(() => expect(pageErrors).toEqual([]));
async function seedCart(quantity = 2) {
  expect(
    (
      await fixture.customer.api.post("/cart/items", {
        data: { productId: fixture.washer.productID, quantity },
      })
    ).status(),
  ).toBe(201);
}
async function login(
  page,
  destination = "/checkout",
  account = fixture.customer,
) {
  await page.goto("/login");
  await page.getByLabel("Username or email").fill(account.username);
  await page.getByLabel("Password", { exact: true }).fill(account.password);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).not.toHaveURL(/\/login$/);
  await page.goto(destination);
}
async function fillDelivery(page) {
  await page.getByLabel("First name", { exact: true }).fill("Test");
  await page.getByLabel("Last name", { exact: true }).fill("Customer");
  await page
    .getByLabel("Email address", { exact: true })
    .fill("checkout@example.com");
  await page.getByLabel("Phone number", { exact: true }).fill("0771234567");
  await page
    .getByLabel("Address line 1", { exact: true })
    .fill("123 Test Road");
  await page.getByLabel(/^Address line 2/).fill("Unit 2");
  await page.getByLabel("City", { exact: true }).fill("Colombo");
  await page.getByLabel("Postal code", { exact: true }).fill("00100");
  await page.getByLabel("Country code", { exact: true }).fill("LK");
}
const summary = (page) =>
  page.getByRole("complementary", { name: "Order summary" });
const submit = (page) =>
  page.getByRole("button", { name: "Prepare checkout", exact: true });
const ready = (page) =>
  page.getByRole("heading", {
    name: "Checkout ready for payment",
    exact: true,
  });
async function noOverflow(page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
}

test("PayHere success is accepted only after backend verification", async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.payhere = {
      startPayment(payment) {
        window.__startedPayHerePayment = payment;
      },
    };
  });
  await seedCart(1);
  await login(page);
  await fillDelivery(page);
  await submit(page).click();
  await expect(ready(page)).toBeVisible();
  const response = page.waitForResponse(
    (item) =>
      item.url().endsWith("/payments/initiate") &&
      item.request().method() === "POST",
  );
  await page
    .getByRole("button", { name: "Pay with PayHere", exact: true })
    .click();
  const initiation = await (await response).json();
  const paymentData = await page.evaluate(() => window.__startedPayHerePayment);
  expect(paymentData.order_id).toBe(initiation.payment.orderId);
  expect(paymentData.amount).toBe("1234.50");
  expect(paymentData.sandbox).toBe(true);
  await expect(
    page.getByRole("button", { name: "Processing payment...", exact: true }),
  ).toBeDisabled();
  const secretHash = createHash("md5")
    .update("frontend-e2e-payhere-secret")
    .digest("hex")
    .toUpperCase();
  const signature = createHash("md5")
    .update(
      `1238776${paymentData.order_id}${paymentData.amount}${paymentData.currency}2${secretHash}`,
    )
    .digest("hex")
    .toUpperCase();
  const callback = await fixture.customer.api.post("/payments/payhere/notify", {
    form: {
      merchant_id: "1238776",
      order_id: paymentData.order_id,
      payment_id: `E2E-${randomUUID()}`,
      payhere_amount: paymentData.amount,
      payhere_currency: paymentData.currency,
      status_code: "2",
      md5sig: signature,
    },
  });
  expect(callback.status()).toBe(200);
  await page.evaluate(() =>
    window.payhere.onCompleted("untrusted-browser-value"),
  );
  await expect(page).toHaveURL(new RegExp(`/orders/${paymentData.order_id}$`));
  await expect(
    page.getByText("Confirmed", { exact: true }).first(),
  ).toBeVisible();
});

test("Cart opens Checkout, validates delivery and renders the real trusted summary", async ({
  page,
}, info) => {
  await seedCart();
  await login(page, "/cart");
  await page
    .getByRole("link", { name: "Proceed to checkout", exact: true })
    .click();
  await expect(page).toHaveURL(/\/checkout$/);
  await expect(
    summary(page).getByText(fixture.washer.name, { exact: true }),
  ).toBeVisible();
  await expect(
    summary(page).getByText("Not yet validated", { exact: true }),
  ).toBeVisible();
  await submit(page).click();
  await expect(page.getByLabel("First name", { exact: true })).toBeFocused();
  await expect(
    page.getByText("This field is required.", { exact: true }).first(),
  ).toBeVisible();
  await fillDelivery(page);
  await page.getByLabel("Phone number", { exact: true }).fill("123");
  await submit(page).click();
  await expect(
    page.getByText("Enter a valid Sri Lankan or international phone number.", {
      exact: true,
    }),
  ).toBeVisible();
  await page.getByLabel("Phone number", { exact: true }).fill("0771234567");
  const response = page.waitForResponse(
    (res) =>
      res.url().endsWith("/checkout/prepare") &&
      res.request().method() === "POST",
  );
  await submit(page).click();
  const res = await response;
  expect(res.status()).toBe(200);
  expect(Object.keys(res.request().postDataJSON())).toEqual(["delivery"]);
  expect(res.request().postDataJSON().delivery).not.toHaveProperty("total");
  const data = await res.json();
  expect(data.total).toBe("2469.00");
  await expect(ready(page)).toBeVisible();
  await expect(
    summary(page).getByText("LKR 2,469.00", { exact: true }).last(),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Validated delivery details" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Pay with PayHere", exact: true }),
  ).toBeVisible();
  await noOverflow(page);
  await page.screenshot({
    path: info.outputPath("checkout-validated.png"),
    fullPage: true,
  });
  await page.getByLabel("City", { exact: true }).fill("Kandy");
  await expect(ready(page)).toHaveCount(0);
  await expect(
    summary(page).getByText("Not yet validated", { exact: true }),
  ).toBeVisible();
  await submit(page).click();
  await expect(ready(page)).toBeVisible();
  const cart = await (await fixture.customer.api.get("/cart")).json();
  expect(cart.items[0].quantity).toBe(2);
  const product = await (
    await fixture.admin.api.get("/products/" + fixture.washer.productID)
  ).json();
  expect(product.stockQty).toBe(3);
  await page.reload();
  await expect(page.getByLabel("First name", { exact: true })).toHaveValue("");
  await expect(ready(page)).toHaveCount(0);
});

test("updated backend prices and cart quantities replace the displayed summary", async ({
  page,
}) => {
  await seedCart();
  await login(page);
  await fillDelivery(page);
  const cart = await (await fixture.customer.api.get("/cart")).json();
  await fixture.admin.api.patch(`/products/${fixture.washer.productID}`, {
    data: { price: 0.1 },
  });
  await fixture.customer.api.patch(`/cart/items/${cart.items[0].id}`, {
    data: { quantity: 3 },
  });
  await submit(page).click();
  await expect(ready(page)).toBeVisible();
  await expect(
    page.getByText(
      "Product prices have changed. Review the updated prices and final amount in your validated summary.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(
    summary(page).getByText("LKR 0.30", { exact: true }).last(),
  ).toBeVisible();
  await expect(summary(page).getByText(/Quantity: 3/)).toBeVisible();
  await page.getByLabel("City", { exact: true }).fill("Kandy");
  await expect(ready(page)).toHaveCount(0);
  await expect(
    summary(page).getByText("Not yet validated", { exact: true }),
  ).toBeVisible();
  await expect(
    summary(page).getByText("LKR 0.30", { exact: true }),
  ).toBeVisible();
});

test("stock, unavailable products and emptied carts keep delivery data recoverable", async ({
  page,
}) => {
  await seedCart();
  await login(page);
  await fillDelivery(page);
  await fixture.admin.api.patch(`/products/${fixture.washer.productID}/stock`, {
    data: { stockQty: 1 },
  });
  await submit(page).click();
  await expect(
    page
      .getByRole("alert")
      .filter({ hasText: "Insufficient stock for cart product" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Review and fix cart" }),
  ).toBeVisible();
  await expect(page.getByLabel("Address line 1", { exact: true })).toHaveValue(
    "123 Test Road",
  );
  await expect(submit(page)).toBeDisabled();
  await expect(ready(page)).toHaveCount(0);
  await fixture.admin.api.patch(`/products/${fixture.washer.productID}/stock`, {
    data: { stockQty: 3 },
  });
  await page.getByRole("button", { name: "Refresh cart", exact: true }).click();
  await expect(submit(page)).toBeEnabled();
  await fixture.admin.api.patch(`/products/${fixture.washer.productID}`, {
    data: { isActive: false },
  });
  await submit(page).click();
  await expect(
    page
      .getByRole("alert")
      .filter({ hasText: "Cart product is no longer available" }),
  ).toBeVisible();
  await expect(submit(page)).toBeDisabled();
  await fixture.admin.api.patch(`/products/${fixture.washer.productID}`, {
    data: { isActive: true },
  });
  await page.getByRole("button", { name: "Refresh cart", exact: true }).click();
  await expect(submit(page)).toBeEnabled();
  await fixture.customer.api.delete("/cart");
  await submit(page).click();
  await expect(
    page.getByRole("heading", { name: "Your cart is empty" }),
  ).toBeVisible();
  await expect(ready(page)).toHaveCount(0);
  await noOverflow(page);
});

test("loading, duplicate clicks and network errors are handled without losing entries", async ({
  page,
}) => {
  await seedCart();
  await login(page);
  let releaseRead;
  const readGate = new Promise((resolve) => {
    releaseRead = resolve;
  });
  await page.route(`${backendUrl}/cart`, async (route) => {
    await readGate;
    await route.continue();
  });
  await page.reload();
  await expect(
    page.getByText("Loading checkout...", { exact: true }),
  ).toBeVisible();
  releaseRead();
  await expect(submit(page)).toBeVisible();
  await page.unroute(`${backendUrl}/cart`);
  await fillDelivery(page);
  let releaseWrite,
    requests = 0;
  const gate = new Promise((resolve) => {
    releaseWrite = resolve;
  });
  await page.route(`${backendUrl}/checkout/prepare`, async (route) => {
    requests++;
    await gate;
    await route.continue();
  });
  await submit(page).click();
  await expect(
    page.getByRole("button", { name: "Preparing checkout...", exact: true }),
  ).toBeDisabled();
  await expect(page.getByLabel("First name", { exact: true })).toBeDisabled();
  await page.locator("form button[type=submit]").evaluate((button) => {
    button.click();
    button.click();
  });
  expect(requests).toBe(1);
  releaseWrite();
  await expect(ready(page)).toBeVisible();
  await page.unroute(`${backendUrl}/checkout/prepare`);
  await page.getByLabel("City", { exact: true }).fill("Kandy");
  await page.route(`${backendUrl}/checkout/prepare`, (route) =>
    route.abort("failed"),
  );
  await submit(page).click();
  await expect(page.getByRole("alert")).toContainText(
    "Unable to prepare checkout. Your delivery details are still here. Please try again.",
  );
  await expect(submit(page)).toBeEnabled();
  await expect(page.getByLabel("City", { exact: true })).toHaveValue("Kandy");
  await expect(ready(page)).toHaveCount(0);
  await page.unroute(`${backendUrl}/checkout/prepare`);
  await submit(page).click();
  await expect(ready(page)).toBeVisible();
  await page.route(`${backendUrl}/cart`, (route) => route.abort("failed"));
  await page.reload();
  await expect(page.getByRole("alert")).toContainText(
    "Unable to load your checkout. Please try again.",
  );
  await page.unroute(`${backendUrl}/cart`);
  await page.getByRole("button", { name: "Refresh cart", exact: true }).click();
  await expect(submit(page)).toBeVisible();
});

test("guest/staff restrictions and expired sessions reuse existing authentication", async ({
  page,
}) => {
  await page.goto("/checkout");
  await expect(page).toHaveURL(/\/login$/);
  await page.getByLabel("Username or email").fill(fixture.customer.username);
  await page
    .getByLabel("Password", { exact: true })
    .fill(fixture.customer.password);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL(/\/checkout$/);
  await expect(
    page.getByRole("heading", { name: "Your cart is empty" }),
  ).toBeVisible();
  await seedCart();
  await page.reload();
  await fillDelivery(page);
  // Remove only this browser context's cookies to simulate an expired session.
  await page.context().clearCookies();
  await submit(page).click();
  await expect(page).toHaveURL(/\/login$/);
  await login(page, "/checkout", fixture.admin);
  await expect(page).toHaveURL(/\/forbidden$/);
});
