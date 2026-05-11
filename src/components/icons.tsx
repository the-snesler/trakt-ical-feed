import {
  siGithub,
  siTrakt,
  siGooglecalendar,
  siApple,
} from "simple-icons";

type SimpleIconLike = { svg: string };

export const Icons = {
  github: siGithub,
  trakt: siTrakt,
  googleCalendar: siGooglecalendar,
  apple: siApple,
};

export const BrandIcon = ({
  icon,
  size = 18,
}: {
  icon: SimpleIconLike;
  size?: number;
}) => (
  <span
    class="brand-icon"
    style={`width:${size}px;height:${size}px`}
    dangerouslySetInnerHTML={{ __html: icon.svg }}
  />
);

export const brandIconStyles = `
  .brand-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: inherit;
    flex-shrink: 0;
  }
  .brand-icon svg {
    width: 100%;
    height: 100%;
    fill: currentColor;
  }
`;
