using System.Text.Json.Serialization;

namespace EveryoneIsJohn_API.Data.Objects
{
    public class User : DataObject
    {
        #region Constructors

        public User(string key, string name) : base()
        {
            Key = key;
            Name = name;
        }

        #endregion Constructors

        #region Properties

        [JsonIgnore]
        public string Key { get; private set; }

        public string Name { get; set; }

        #endregion Properties
    }
}