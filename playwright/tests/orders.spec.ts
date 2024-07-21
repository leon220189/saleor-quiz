import { ADDRESS } from "@data/addresses";
import { ORDERS, PRODUCTS } from "@data/e2eTestData";
import { AddressesListPage } from "@pages/addressesListPage";
import { AddressDialog } from "@pages/dialogs/addressDialog";
import { DraftOrdersPage } from "@pages/draftOrdersPage";
import { AddressForm } from "@pages/forms/addressForm";
import { FulfillmentPage } from "@pages/fulfillmentPage";
import { OrdersPage } from "@pages/ordersPage";
import { RefundPage } from "@pages/refundPage";
import { expect, test } from "@playwright/test";

test.use({ storageState: "./playwright/.auth/admin.json" });

let ordersPage: OrdersPage;
let draftOrdersPage: DraftOrdersPage;
let fulfillmentPage: FulfillmentPage;
let addressDialog: AddressDialog;
let addressForm: AddressForm;
let addressesListPage: AddressesListPage;
let refundPage: RefundPage;

test.beforeEach(({ page }) => {
  ordersPage = new OrdersPage(page);
  draftOrdersPage = new DraftOrdersPage(page);
  fulfillmentPage = new FulfillmentPage(page);
  addressDialog = new AddressDialog(page);
  addressesListPage = new AddressesListPage(page);
  addressForm = new AddressForm(page);
  refundPage = new RefundPage(page);
});

const variantSKU = PRODUCTS.productAvailableWithTransactionFlow.variant1sku;

test("TC: SALEOR_28 Create basic order @e2e @order", async () => {
  await ordersPage.goToOrdersListView();
  await ordersPage.clickCreateOrderButton();
  await ordersPage.orderCreateDialog.completeOrderCreateDialogWithFirstChannel();
  await ordersPage.clickAddProductsButton();
  await draftOrdersPage.addProductsDialog.selectVariantBySKU(variantSKU);
  await draftOrdersPage.addProductsDialog.clickConfirmButton();
  await ordersPage.rightSideDetailsPage.clickEditCustomerButton();
  await ordersPage.rightSideDetailsPage.clickSearchCustomerInput();
  await ordersPage.rightSideDetailsPage.selectCustomer();
  await ordersPage.addressDialog.clickConfirmButton();
  await ordersPage.clickAddShippingCarrierButton();
  await ordersPage.shippingAddressDialog.pickAndConfirmFirstShippingMethod();
  await ordersPage.clickFinalizeButton();
  await draftOrdersPage.expectSuccessBannerMessage("finalized");
});

test("TC: SALEOR_76 Create order with transaction flow activated @e2e @order", async () => {
  await ordersPage.goToOrdersListView();
  await ordersPage.clickCreateOrderButton();
  await ordersPage.orderCreateDialog.completeOrderCreateDialogWithTransactionChannel();
  await ordersPage.clickAddProductsButton();
  await draftOrdersPage.addProductsDialog.selectVariantBySKU(variantSKU);
  await draftOrdersPage.addProductsDialog.clickConfirmButton();
  await ordersPage.rightSideDetailsPage.clickEditCustomerButton();
  await ordersPage.rightSideDetailsPage.clickSearchCustomerInput();
  await ordersPage.rightSideDetailsPage.selectCustomer();
  await expect(ordersPage.addressDialog.existingAddressRadioButton).toBeVisible();
  await ordersPage.addressDialog.clickConfirmButton();
  await ordersPage.clickAddShippingCarrierButton();
  await ordersPage.shippingAddressDialog.pickAndConfirmFirstShippingMethod();
  await ordersPage.clickFinalizeButton();
  await draftOrdersPage.expectSuccessBannerMessage("finalized");
});

test("TC: SALEOR_77 Mark order as paid and fulfill it with transaction flow activated @e2e @order", async () => {
  await ordersPage.goToExistingOrderPage(
    ORDERS.ordersWithinTransactionFlow.markAsPaidOrder.orderId,
  );
  await ordersPage.clickMarkAsPaidButton();
  await ordersPage.markOrderAsPaidDialog.typeAndSaveOrderReference();
  await ordersPage.expectSuccessBannerMessage("paid");

  const transactionsMadeRows = await ordersPage.orderTransactionsList.locator("tr");

  expect(await transactionsMadeRows.count()).toEqual(1);
  await expect(transactionsMadeRows).toContainText("Success");
  await ordersPage.clickFulfillButton();
  await fulfillmentPage.clickFulfillButton();
  await ordersPage.expectSuccessBannerMessage("fulfilled");
  expect(await ordersPage.pageHeaderStatusInfo).toContainText("Fulfilled");
});

test("TC: SALEOR_78 Capture partial amounts by manual transactions and fulfill order with transaction flow activated @e2e @order", async () => {
  const firstManualTransactionAmount = "100";
  const secondManualTransactionAmount = "20";

  test.slow();

  await ordersPage.goToExistingOrderPage(
    ORDERS.ordersWithinTransactionFlow.captureManualTransactionOrder.orderId,
  );
  await ordersPage.clickManualTransactionButton();
  await ordersPage.manualTransactionDialog.completeManualTransactionDialogAndSave(
    "partial payment 1",
    "111111",
    firstManualTransactionAmount,
  );

  const completedTransactionsRows = await ordersPage.orderTransactionsList.locator("tr");

  await expect(
    completedTransactionsRows.filter({
      hasText: `EUR${firstManualTransactionAmount}`,
    }),
    "Row with first manual transaction details is visible with Success status",
  ).toContainText("Success");
  expect(await ordersPage.pageHeaderStatusInfo, "Order should not be yet fulfilled").toContainText(
    "Unfulfilled",
  );
  expect(await ordersPage.paymentStatusInfo, "Order should be partially paid").toContainText(
    "Partially paid",
  );
  await ordersPage.clickManualTransactionButton();
  await ordersPage.manualTransactionDialog.completeManualTransactionDialogAndSave(
    "partial payment 2",
    "222222",
    secondManualTransactionAmount,
  );
  await expect(
    completedTransactionsRows.filter({
      hasText: `EUR${secondManualTransactionAmount}`,
    }),
    "Row with first manual transaction details is visible with Success status",
  ).toContainText("Success");
  expect(
    await completedTransactionsRows.filter({ hasText: "Success" }).count(),
    "Two rows are visible within Manual capture sections with Success status",
  ).toEqual(2);
  expect(await ordersPage.pageHeaderStatusInfo, "Order should not be yet fulfilled").toContainText(
    "Unfulfilled",
  );
  expect(await ordersPage.paymentStatusInfo, "Order should be fully paid").toContainText(
    "Fully paid",
  );
  await ordersPage.clickFulfillButton();
  await fulfillmentPage.clickFulfillButton();
  await ordersPage.expectSuccessBannerMessage("fulfilled");
  expect(await ordersPage.pageHeaderStatusInfo, "Order should be yet fulfilled").toContainText(
    "Fulfilled",
  );
});

test("TC: SALEOR_79 Mark order as paid and fulfill it with regular flow @e2e @order", async () => {
  await ordersPage.goToExistingOrderPage(ORDERS.orderToMarkAsPaidAndFulfill.id);
  await ordersPage.clickMarkAsPaidButton();
  await ordersPage.markOrderAsPaidDialog.typeAndSaveOrderReference();
  await ordersPage.expectSuccessBannerMessage("paid");
  await expect(ordersPage.balanceStatusInfo).toHaveText("Settled");
  expect(await ordersPage.paymentStatusInfo, "Order should be fully paid").toContainText(
    "Fully paid",
  );

  await ordersPage.clickFulfillButton();
  await fulfillmentPage.clickFulfillButton();
  await ordersPage.expectSuccessBannerMessage("fulfilled");
  expect(await ordersPage.pageHeaderStatusInfo).toContainText("Fulfilled");
});

test("TC: SALEOR_80 Add tracking to order @e2e @order", async () => {
  const trackingNumber = "123456789";

  await ordersPage.goToExistingOrderPage(ORDERS.orderToAddTrackingNumberTo.id);
  await ordersPage.clickAddTrackingButton();
  await ordersPage.addTrackingDialog.typeTrackingNumberAndSave(trackingNumber);
  await ordersPage.expectSuccessBannerMessage("updated");
  await expect(ordersPage.setTrackingNumber).toContainText(trackingNumber);
});

test("TC: SALEOR_81 Change billing address in fulfilled order @e2e @order", async () => {
  await ordersPage.goToExistingOrderPage(ORDERS.orderFulfilledToChangeBillingAddress.id);
  await ordersPage.rightSideDetailsPage.clickEditBillingAddressButton();
  await ordersPage.addressDialog.clickNewAddressRadioButton();

  const newAddress = ADDRESS.addressPL;

  await addressForm.completeBasicInfoAddressForm(newAddress);
  await addressForm.typeCompanyName(newAddress.companyName);
  await addressForm.typePhone(newAddress.phone);
  await addressForm.typeAddressLine2(newAddress.addressLine2);
  await addressDialog.clickConfirmButton();

  await ordersPage.expectSuccessBanner();

  await addressesListPage.verifyRequiredAddressFields(newAddress.firstName, newAddress);
  await addressesListPage.verifyPhoneField(newAddress.firstName, newAddress);
  await addressesListPage.verifyCompanyField(newAddress.firstName, newAddress);
  await addressesListPage.verifyAddressLine2Field(newAddress.firstName, newAddress);
  await expect(ordersPage.rightSideDetailsPage.billingAddressSection).toContainText(
    ADDRESS.addressPL.firstName,
  );
  await expect(ordersPage.rightSideDetailsPage.billingAddressSection).toContainText(
    ADDRESS.addressPL.firstName,
  );
});

test("TC: SALEOR_82 Change shipping address in not fulfilled order @e2e @order", async () => {
  await ordersPage.goToExistingOrderPage(ORDERS.orderNotFulfilledToChangeShippingAddress.id);
  await ordersPage.rightSideDetailsPage.clickEditShippingAddressButton();
  await ordersPage.addressDialog.clickNewAddressRadioButton();

  const newAddress = ADDRESS.addressPL;

  await addressForm.completeBasicInfoAddressForm(newAddress);
  await addressForm.typeCompanyName(newAddress.companyName);
  await addressForm.typePhone(newAddress.phone);
  await addressForm.typeAddressLine2(newAddress.addressLine2);
  addressDialog.clickConfirmButton();
  await ordersPage.expectSuccessBanner();
  await addressesListPage.verifyRequiredAddressFields(newAddress.firstName, newAddress);
  await addressesListPage.verifyPhoneField(newAddress.firstName, newAddress);
  await addressesListPage.verifyCompanyField(newAddress.firstName, newAddress);
  await addressesListPage.verifyAddressLine2Field(newAddress.firstName, newAddress);
  await expect(ordersPage.rightSideDetailsPage.shippingAddressSection).toContainText(
    ADDRESS.addressPL.firstName,
  );
});

test("TC: SALEOR_83 Draft orders bulk delete @e2e @draft", async () => {
  await draftOrdersPage.goToDraftOrdersListView();
  await draftOrdersPage.checkListRowsBasedOnContainingText(ORDERS.draftOrdersToBeDeleted.ids);
  await draftOrdersPage.clickBulkDeleteButton();
  await draftOrdersPage.deleteDraftOrdersDialog.clickDeleteButton();
  await draftOrdersPage.expectSuccessBanner();
  await draftOrdersPage.waitForGrid();
  await expect(
    await draftOrdersPage.findRowIndexBasedOnText(PRODUCTS.productsToBeBulkDeleted.names),
    `Given draft orders: ${ORDERS.draftOrdersToBeDeleted.ids} should be deleted from the list`,
  ).toEqual([]);
});

test("TC: SALEOR_84 Create draft order @e2e @draft", async () => {
  test.slow();
  await draftOrdersPage.goToDraftOrdersListView();
  await draftOrdersPage.clickCreateDraftOrderButton();
  await draftOrdersPage.draftOrderCreateDialog.completeDraftOrderCreateDialogWithFirstChannel();
  await draftOrdersPage.clickAddProductsButton();
  await draftOrdersPage.addProductsDialog.searchForProductInDialog(
    PRODUCTS.productAvailableWithTransactionFlow.name,
  );
  await draftOrdersPage.addProductsDialog.selectVariantBySKU(variantSKU);
  await draftOrdersPage.addProductsDialog.clickConfirmButton();
  await draftOrdersPage.rightSideDetailsPage.clickEditCustomerButton();
  await draftOrdersPage.rightSideDetailsPage.clickSearchCustomerInput();
  await draftOrdersPage.rightSideDetailsPage.selectCustomer();
  await draftOrdersPage.expectSuccessBanner();
  await draftOrdersPage.addressDialog.clickConfirmButton();
  await draftOrdersPage.expectSuccessBanner();
  await draftOrdersPage.clickAddShippingCarrierButton();
  await draftOrdersPage.shippingAddressDialog.pickAndConfirmFirstShippingMethod();
  await draftOrdersPage.expectSuccessBanner();
  await draftOrdersPage.clickFinalizeButton();
  await draftOrdersPage.expectSuccessBannerMessage("finalized");
});

test("TC: SALEOR_191 Refund products from the fully paid order @e2e @refunds", async () => {
  const order = ORDERS.fullyPaidOrderWithSingleTransaction;

  await ordersPage.goToExistingOrderPage(order.id);
  await ordersPage.clickAddRefundButton();
  await ordersPage.orderRefundDialog.pickLineItemsRefund();
  await ordersPage.orderRefundModal.waitFor({ state: "hidden" });
  await refundPage.expectAddLineItemsRefundPageOpen(order.id);
  await refundPage.pickAllProductQuantityToRefund(order.lineItems[0].name);

  const productRow = await refundPage.getProductRow(order.lineItems[0].name);

  expect(productRow.locator(refundPage.productQuantityInput)).toHaveValue(
    order.lineItems[0].quantity,
  );

  const refundReason = "Expectations not met";

  await refundPage.inputProductLineQuantity(order.lineItems[1].name, "1");
  await refundPage.clickLineRefundReasonButton(order.lineItems[0].name);
  await refundPage.addLineRefundReasonDialog.provideLineRefundReason("Item is damaged");
  await refundPage.addLineRefundReasonDialog.submitLineRefundReason();
  await refundPage.provideRefundReason(refundReason);
  await refundPage.saveDraft();
  await refundPage.expectSuccessBanner();
  await ordersPage.goToExistingOrderPage(order.id);
  await ordersPage.orderRefundSection.waitFor({ state: "visible" });
  await ordersPage.assertRefundOnList(refundReason);
  await ordersPage.clickEditRefundButton(refundReason);
  await refundPage.transferFunds();
  await refundPage.expectSuccessBannerMessage("Refund has been sent");
});

test("TC: SALEOR_192 Should create a manual refund with a custom amount @e2e @refunds", async () => {
  const order = ORDERS.fullyPaidOrderWithSeveralTransactions;

  await ordersPage.goToExistingOrderPage(order.id);
  await ordersPage.clickAddRefundButton();
  await ordersPage.orderRefundDialog.pickManualRefund();
  await ordersPage.orderRefundModal.waitFor({ state: "hidden" });
  await refundPage.expectManualRefundPageOpen(order.id);
  await refundPage.selectTransactionToRefund(order.transactionToRefundId);
  await refundPage.transferFunds();
  await refundPage.expectErrorMessage("You must provide amount value");
  await refundPage.provideRefundAmount("1000");
  await refundPage.expectErrorMessage(
    "Provided amount cannot exceed charged amount for the selected transaction",
  );
  await refundPage.provideRefundAmount("10");
  await refundPage.transferFunds();
  await refundPage.expectSuccessBannerMessage("Transaction action requested successfully");
  await ordersPage.goToExistingOrderPage(order.id);
  await ordersPage.orderRefundSection.waitFor({ state: "visible" });
  await ordersPage.assertRefundOnList("Manual refund");
});

const orderRefunds = ORDERS.orderWithRefundsInStatusOtherThanSuccess.refunds;

for (const refund of orderRefunds) {
  test(`TC: SALEOR_193 Update order with non-manual refund in ${refund.status} status @e2e @refunds`, async () => {
    await ordersPage.goToExistingOrderPage(ORDERS.orderWithRefundsInStatusOtherThanSuccess.id);
    await ordersPage.orderRefundList.scrollIntoViewIfNeeded();

    const orderRefundListRow = await ordersPage.orderRefundList.locator("tr");
    const pendingRefunds = await orderRefundListRow.filter({ hasText: "PENDING" }).all();

    for (const pendingRefund of pendingRefunds) {
      await expect(pendingRefund.locator(ordersPage.editRefundButton)).toBeDisabled();
    }
    await ordersPage.clickEditRefundButton(refund.status);
    await refundPage.expectEditLineItemsRefundPageOpen(
      ORDERS.orderWithRefundsInStatusOtherThanSuccess.id,
      refund.id,
    );
    await refundPage.transferFunds();
    await refundPage.expectSuccessBanner();
    await expect(ordersPage.orderRefundList).not.toContainText(refund.status);
  });
}