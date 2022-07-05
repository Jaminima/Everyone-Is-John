namespace EveryoneIsJohn_API.Data.Objects
{
    public class John : DataObject
    {
        #region Constructors

        public John(User user, string johnsName = "John")
        {
            Creator = user.Identifier;
            Name = johnsName;
            scores = new List<Score>();
            pendingPlayers = new List<int>();
        }

        #endregion Constructors

        #region Properties

        public int Creator { get; private set; }

        public string Name { get; set; }

        public List<int> pendingPlayers { get; set; }

        public List<Score> scores { get; set; }

        #endregion Properties

        #region Methods

        public bool GrantPending(int userId)
        {
            if (pendingPlayers.Remove(userId))
            {
                scores.Add(new Score(userId));
                return true;
            }
            return false;
        }

        #endregion Methods
    }
}