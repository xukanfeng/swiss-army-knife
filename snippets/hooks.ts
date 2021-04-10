type noop = (...args: any[]) => any

function usePersistFn<T extends noop> (fn: T) {
  const fnRef = useRef<T>(fn);
  fnRef.current = fn;

  const persistRef = useRef<T>();
  if (!persistRef.current) {
    persistRef.current = function (...args) {
      return fnRef.current!.apply(this, args);
    } as T;
  };
  return persistRef.current!;

  // return useCallback((...args) => fnRef.current(...args), [fnRef]);
}

type compareFunction<T> = (prev: T | undefined, next: T) => boolean;

function usePrevious<T>(state: T, compare?: compareFunction<T>): T | undefined {
  const prevRef = useRef<T>();
  const curRef = useRef<T>();

  const needUpdate = typeof compare === 'function' ? compare(curRef.current, state) : true;
  if (needUpdate) {
    prevRef.current = curRef.current;
    curRef.current = state;
  }

  return prevRef.current;

  const ref = useRef()
  useEffect(() => {
    ref.current = state
  })
  return ref.current
}

/**
 * unstated
 */
function createContainer(useHook) {
  const EMPTY = Symbol()
  const Context = React.createContext(EMPTY)

  function Provider(props) {
    let value = useHook(props.initialState)
    return <Context.Provider value={value}>{props.children}</Context.Provider>
  }

  function useContainer() {
    let value = React.useContext(Context)
    if (value === EMPTY) {
      throw new Error()
    }
    return value
  }

  return { Provider, useContainer }
}

function useContainer(container) {
  return container.useContainer()
}