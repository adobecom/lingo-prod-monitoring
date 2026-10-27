module.exports = {
  // Every inline price element (resolved or not)
  price: 'span[is="inline-price"]',
  // Rendered once Merch-at-Scale (M@S) has resolved the price
  resolved: 'span[is="inline-price"].placeholder-resolved',
  amount: 'span[is="inline-price"].placeholder-resolved > .price',
  currencySymbol: '.price-currency-symbol',
  taxLabel: '.price-tax-inclusivity:not(.disabled)',
};
