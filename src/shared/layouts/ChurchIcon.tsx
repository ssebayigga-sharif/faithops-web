import { ComponentProps } from "react";
import logo from "./Assets/kesda.png";

type ChurchIconProps = Omit<ComponentProps<"img">, "src" | "alt"> & {
  size?: number;
};
const ChurchIcon = ({ size = 40, ...rest }: ChurchIconProps) => (
  <img
    alt="Seventh-day Adventist Church"
    height={size}
    src={logo}
    width={size}
    style={{ borderRadius: "50%", objectFit: "cover" }}
    {...rest}
  />
);

export default ChurchIcon;

/**
 * Official Seventh-day Adventist Church symbol (the flame / open-Bible /
 * cross mark). This is a registered trademark of the General Conference
 * of Seventh-day Adventists.
 *
 * Local churches and approved institutions may use the trademark in their
 * ministries once their status is approved by their local conference or
 * mission (see https://adventist.org/trademark-and-logo-usage). The GC
 * asks that the symbol not be creatively modified, recolored, cropped, or
 * merged into another logo — so this component renders the asset as-is,
 * with no compositing.
 *
 * Ideally, swap /assets/sda-logo.png for the official local-church variant
 * (with "Kabulengwa Seventh-day Adventist Church" as the entity identifier)
 * downloadable from your division's brand guidelines page, e.g.
 * https://www.nadadventist.org/about/brand-guidelines/logo/ — that gives
 * you a proper SVG/EPS source instead of a flattened PNG.
 */
