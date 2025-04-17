module.exports = (sequelize, DataTypes) => {
    const Chapter = sequelize.define("Chapter", {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      index_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT("long"), // to support large HTML content
        allowNull: true,
      },
    });
  
    return Chapter;
  };