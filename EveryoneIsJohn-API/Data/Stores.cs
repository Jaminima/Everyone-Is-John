namespace EveryoneIsJohn_API.Data
{
    public static class Stores
    {
        #region Fields

        public static Store<Objects.John> johnStore = new Store<Objects.John>();
        public static Store<Objects.User> userStore = new Store<Objects.User>();

        #endregion Fields
    }
}