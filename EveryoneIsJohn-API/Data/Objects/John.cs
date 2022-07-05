using System.Text.Json.Serialization;

namespace EveryoneIsJohn_API.Data.Objects
{
    public class John : DataObject
    {
        #region Fields

        public List<Item> inventory;

        #endregion Fields

        #region Constructors

        public John(User user, string johnsName = "John")
        {
            Creator = user.Identifier;
            Name = johnsName;
            players = new List<Player>();
            inventory = new List<Item>();
            pendingPlayers = new List<int>();
        }

        #endregion Constructors

        #region Properties

        public int Creator { get; private set; }

        public string Name { get; set; }
        public List<int> pendingPlayers { get; set; }

        [JsonIgnore]
        public List<Player> players { get; set; }

        #endregion Properties

        #region Methods

        public bool GrantPending(int userId)
        {
            if (pendingPlayers.Remove(userId))
            {
                players.Add(new Player(userId));
                return true;
            }
            return false;
        }

        #endregion Methods
    }
}