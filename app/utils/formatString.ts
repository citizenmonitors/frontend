const formatString = {
  kebabCase(str: string): string {
    return str.split(" ").join("-").toLowerCase();
  },
  capitaliseFirst(str: string, onlyFirst = false) {
    if (!str) return "";
    const firstLetter = str.charAt(0).toUpperCase();
    const restLetters = onlyFirst ? str.slice(1) : str.slice(1).toLowerCase();
    return firstLetter + restLetters;
  },
  normalCase(input: string | Array<string>) {
    let strings = []
    if (Array.isArray(input)) {
      strings = input;
    } else {
      strings = input.split(" ");
    }
    return strings.map((str) => this.capitaliseFirst(str)).join(" ");
  },
  kebabToNormalCase(kebab: string, onlyFirst = false): string {
    return kebab
      .split('-')
      .map((word) => this.capitaliseFirst(word, onlyFirst))
      .join(' ');
  }
};

export default formatString;