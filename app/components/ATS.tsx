import React from "react";

type Suggestion = {
  type: "good" | "improve";
  tip: string;
};

interface ATSProps {
  score: number; // 0–100
  suggestions: Suggestion[];
}

const ATS: React.FC<ATSProps> = ({ score, suggestions }) => {
  const safeScore = Math.max(0, Math.min(100, score));

  const backgroundClass =
    safeScore > 69
      ? "from-green-100"
      : safeScore > 49
        ? "from-yellow-100"
        : "from-red-100";

  const atsIcon =
    safeScore > 69
      ? "/icons/ats-good.svg"
      : safeScore > 49
        ? "/icons/ats-warning.svg"
        : "/icons/ats-bad.svg";

  const title =
    safeScore > 69
      ? "Votre CV est bien optimisé pour l’ATS"
      : safeScore > 49
        ? "Votre CV peut être amélioré pour l’ATS"
        : "Votre CV risque d’être mal compris par l’ATS";

  return (
    <div
      className={`rounded-2xl p-6 bg-gradient-to-b ${backgroundClass} to-white shadow-md flex flex-col gap-4`}
    >
      <div className="flex items-center gap-4">
        <img src={atsIcon} alt="ATS status" className="w-10 h-10" />
        <div className="flex flex-col">
          <h3 className="text-lg font-bold text-gray-900">
            ATS Score – {safeScore}/100
          </h3>
          <p className="text-sm text-gray-600">{title}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h4 className="text-sm font-semibold text-gray-800">
          Comment l’ATS perçoit votre CV
        </h4>
        <p className="text-sm text-gray-500">
          Les systèmes de suivi de candidatures (ATS) analysent votre CV
          automatiquement. Les points ci-dessous résument ce qui fonctionne bien
          et ce qui peut être optimisé pour améliorer votre compatibilité.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {suggestions.map((item, index) => {
          const icon =
            item.type === "good" ? "/icons/check.svg" : "/icons/warning.svg";
          const iconAlt =
            item.type === "good" ? "Bon point" : "À améliorer";

          return (
            <div
              key={index}
              className="flex items-start gap-2 text-sm text-gray-800"
            >
              <img src={icon} alt={iconAlt} className="w-4 h-4 mt-1" />
              <p>{item.tip}</p>
            </div>
          );
        })}
      </div>

      <p className="text-sm text-gray-600 mt-2">
        Même un bon score peut être amélioré. En appliquant ces suggestions,
        vous augmentez vos chances de passer les filtres automatiques et
        d’attirer l’attention des recruteurs.
      </p>
    </div>
  );
};

export default ATS;