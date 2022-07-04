namespace EveryoneIsJohn_API.Data.Objects
{
    public class Score
    {
        #region Constructors

        public Score(int user)
        {
            User = user;
            Level1 = 0;
            Level2 = 0;
            Level3 = 0;
        }

        #endregion Constructors

        #region Properties

        public int Level1 { get; set; }
        public int Level2 { get; set; }
        public int Level3 { get; set; }
        public int User { get; set; }

        #endregion Properties
    }
}