const RESULT_NAMES = ['Result', 'SyncResult', 'AsyncResult'];

function isObject(value: unknown): value is { [key: string]: unknown } {
  return typeof value === 'object' && !!value;
}

const serializer: jest.SnapshotSerializerPlugin = {
  print(value) {
    if (isObject(value) && typeof value.debug === 'function') {
      return value.debug({ log: false });
    }

    return '';
  },

  test(value) {
    return (
      isObject(value) &&
      ((value.isRutElement === true && value.constructor.name.endsWith('Element')) ||
        (value.isRutResult === true && RESULT_NAMES.includes(value.constructor.name)))
    );
  },
};

export default serializer;
