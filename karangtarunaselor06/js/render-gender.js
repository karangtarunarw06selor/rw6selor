export const genderIconClass = (gender) => gender === "female" ? "female" : "male";

export const renderGenderIcon = (gender) => {
  const isFemale = gender === "female";
  const icon = isFemale ? "fa-person-dress" : "fa-person";
  const label = isFemale ? "Perempuan" : "Laki-laki";
  return `
    <span class="gender-icon-badge ${genderIconClass(gender)}" aria-label="${label}" title="${label}">
      <i class="fa-solid ${icon}"></i>
    </span>
  `;
};
