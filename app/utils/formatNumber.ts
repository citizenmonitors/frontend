const formatNumber = {
  abbreviate(number: number) {
    const divisors: Array<[number, string]> = [[1000000000, 'B'], [1000000, 'M'], [1000, 'K']];

    for (const [divisor, divisorChar] of divisors) {
      if (number >= divisor) {
        return (number / divisor).toFixed(0) + divisorChar;
      }
    }
    return number.toFixed(0);
  },
  commas(number: number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },
  limit(number: number, limit: number) {
    return Math.min(number, limit) + (number > limit ? '+' : '')
  },
  roundDecimals(number: number, decimals: number) {
    return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
  },
  fileSize(bytes: number) {
    if (bytes <= (512 * 1024)) {
      return String(this.roundDecimals(bytes / 1024, 2)) + 'KB';
    } else {
      return String(this.roundDecimals(bytes / (1024 * 1024), 2)) + 'MB';
    }
  },
  prependZeroes(num: number, count: number = 2) {
    let str = `${num}`;
    for (let index = str.length; index < count; index++) {
      str = '0' + str;
    }
    return str;
  }
}

export default formatNumber;