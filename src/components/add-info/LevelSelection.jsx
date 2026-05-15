import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { useApp } from "../../context/AppContext";

export function LevelSelection() {

    const {
        LEVELS,
        formData,
        setFormData,
        setAdditionalInfoStep
    } = useApp();

    const handleLevelSelect = (level) => {
    setFormData(prev => ({ ...prev, level }));
    };

    const handleNext = () => {
        if (formData.level && formData.level !== '') {
        setAdditionalInfoStep(2);
        }
    };

    return (
    <div className="level-selection">
      <div className="level-selection__content">
        <h3 className="level-selection__title">현재 영어 실력 수준</h3>
        <p className="level-selection__description">
          가장 가까운 수준을 선택해주세요
        </p>
        
        <div className="level-selection__levels">
          {LEVELS.map((levelInfo) => (
            <div
              key={levelInfo.level}
              onClick={() => handleLevelSelect(levelInfo.level)}
              className={`level-card ${
                formData.level === levelInfo.level ? 'level-card--selected' : ''
              }`}
            >
              <div className="level-card__content">
                <div className="level-card__header">
                  <h4 className="level-card__title">
                    Level {levelInfo.level} - {levelInfo.title}
                  </h4>
                </div>
                <p className="level-card__description">{levelInfo.description}</p>
                <div className="level-card__details">
                  {levelInfo.details}
                </div>
              </div>
              <Badge className={`level-badge ${levelInfo.color}`}>
                {levelInfo.title}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      <div className="level-selection__actions">
        <Button
          onClick={handleNext}
          disabled={!formData.level}
          className="level-selection__next-btn"
        >
          다음 단계
        </Button>
      </div>
    </div>
  );
}