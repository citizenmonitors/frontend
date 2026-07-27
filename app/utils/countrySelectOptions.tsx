import countryData from "@/app/data/countryData";

export type CountrySelectOptionData = {
  value: string;
  label: string;
  country: string;
  flag: string;
  isoCode: string;
};

/** Ant Design Select options: all countries with flags (from countryData). */
export function buildCountrySelectOptions(): CountrySelectOptionData[] {
  return countryData.map((country) => ({
    value: country.name,
    label: country.name,
    country: country.name,
    flag: country.flag,
    isoCode: country.isoCode,
  }));
}

export function CountryFlag({
  flag,
  name,
  size = 20,
}: {
  flag: string;
  name: string;
  size?: number;
}) {
  return (
    <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={flag}
        alt={`Flag of ${name}`}
        width={size}
        height={size}
        className="h-full w-full scale-150 object-cover"
      />
    </span>
  );
}

export function filterCountrySelectOption(
  input: string,
  option?: { label?: string; value?: string; country?: string; isoCode?: string }
): boolean {
  const q = input.trim().toLowerCase();
  if (!q) return true;
  const label = String(option?.label ?? option?.country ?? "").toLowerCase();
  const iso = String(option?.isoCode ?? "").toLowerCase();
  return label.includes(q) || iso.includes(q);
}
