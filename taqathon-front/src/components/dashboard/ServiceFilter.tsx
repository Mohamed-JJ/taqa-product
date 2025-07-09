interface ServiceFilterProps {
  currentService: string;
  onServiceChange: (service: string) => void;
}

interface ServiceOption {
  id: number;
  name: string;
  label: string;
}

const services: ServiceOption[] = [
  { id: 6, name: "ALL", label: "Tous les métiers" },
  { id: 1, name: "MC", label: "MC" },
  { id: 2, name: "MM", label: "MM" },
  { id: 3, name: "MD", label: "MD" },
  { id: 4, name: "CT", label: "CT" },
  { id: 5, name: "EL", label: "EL" },
];

export const ServiceFilter = ({ currentService, onServiceChange }: ServiceFilterProps) => {
  return (
    <div className="">
      <p className="text-xl md:text-2xl lg:text-3xl font-medium text-black mb-4 md:mb-6">
        Filtre par métier :
      </p>
      <div className="flex gap-6 w-full items-center">
        {services.map((service) => (
          <div
            key={service.id}
            className={`bg-[#003d553b] text-white px-4 py-2 rounded-md cursor-pointer transition-all duration-300 ${
              currentService === service.name ? "!bg-[#003D55]" : ""
            }`}
            onClick={() => onServiceChange(service.name)}
          >
            {service.label}
          </div>
        ))}
      </div>
    </div>
  );
}; 