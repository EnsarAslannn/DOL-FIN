export const formatLargeMonetaryNumber = (number: number): string | undefined => {
  if (number < 0) {
    return "-" + formatLargeMonetaryNumber(-1 * number)
  }
  if (number < 1000) {
    return "$" + number
  } else if (number >= 1000 && number < 1_000_000) {
    return "$" + (number / 1000).toFixed(1) + "K"
  } else if (number >= 1_000_000 && number < 1_000_000_000) {
    return "$" + (number / 1_000_000).toFixed(1) + "M"
  } else if (number >= 1_000_000_000 && number < 1_000_000_000_000) {
    return "$" + (number / 1_000_000_000).toFixed(1) + "B"
  } else if (number >= 1_000_000_000_000 && number < 1_000_000_000_000_000) {
    return "$" + (number / 1_000_000_000_000).toFixed(1) + "T"
  }
}

export const formatLargeNonMonetaryNumber = (
  number: number,
): string | number | undefined => {
  if (number < 0) {
    // Recurse into *this* formatter, not the monetary one -- delegating there
    // stamped a currency symbol onto a plain number ("-$1.2B" for -1.2B).
    return "-" + formatLargeNonMonetaryNumber(-1 * number)
  }
  if (number < 1000) {
    return number
  } else if (number >= 1000 && number < 1_000_000) {
    return (number / 1000).toFixed(1) + "K"
  } else if (number >= 1_000_000 && number < 1_000_000_000) {
    return (number / 1_000_000).toFixed(1) + "M"
  } else if (number >= 1_000_000_000 && number < 1_000_000_000_000) {
    return (number / 1_000_000_000).toFixed(1) + "B"
  } else if (number >= 1_000_000_000_000 && number < 1_000_000_000_000_000) {
    return (number / 1_000_000_000_000).toFixed(1) + "T"
  }
}

export const formatRatio = (ratio: number) => {
  return (Math.round(ratio * 100) / 100).toFixed(2)
}
