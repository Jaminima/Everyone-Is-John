namespace EveryoneIsJohn_API.Data.Objects
{
    public class Player
    {
        #region Constructors

        public Player(int user)
        {
            User = user;
            missions = new Mission[4];
        }

        #endregion Constructors

        #region Properties

        public Mission[] missions { get; set; }
        public int User { get; set; }

        #endregion Properties

        #region Classes

        public class Mission
        {
            #region Constructors

            public Mission(int level, string desc)
            {
                this.desc = desc;
                this.level = level;
                this.acheived = 0;
                this.suggestedAcheived = 0;
            }

            #endregion Constructors

            #region Properties

            public int acheived { get; set; }
            public string desc { get; set; }
            public int level { get; set; }
            public int suggestedAcheived { get; set; }

            #endregion Properties
        }

        #endregion Classes
    }
}