import Image, { StaticImageData } from "next/image";

interface FeatureCardProps {
  imageSrc: string | StaticImageData;
  title: string;
  subtitle: string;
  description: string;
}

export default function FeatureCard({
  imageSrc,
  title,
  subtitle,
  description,
}: FeatureCardProps) {
  return (
    <div className="md:flex md:items-center mt-8">
      <div className="w-full h-64 md:w-1/2 lg:h-96">
        <Image
          alt={title}
          className="rounded-md object-cover max-w-lg mx-auto"
          width={720}
          height={400}
          src={imageSrc}
          loading="lazy"
          placeholder="blur"
        />
      </div>
      <div className="w-full max-w-lg mx-auto mt-5 md:ml-8 md:mt-0 md:w-1/2">
        <h3 className="text-primary uppercase text-lg">{title}</h3>
        <h2 className="text-primary text-3xl font-semibold">{subtitle}</h2>
        <p className="mt-2 text-secondary-foreground">{description}</p>
      </div>
    </div>
  );
}
