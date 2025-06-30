import React, {useEffect, useState} from "react";

export const TeamInput = React.memo(({initialValue, index, onUpdate, onClear}: any) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return <div>
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => onUpdate(index, value)}
    />
    <button
      onClick={() => {
        onClear(index);
      }}>X
    </button>
  </div>
})
