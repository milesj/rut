const RESULT_NAMES = ['Result', 'SyncResult', 'AsyncResult'];

const serializer: jest.SnapshotSerializerPlugin = {
  print(value) {
    return value.debug({ log: false });
  },

  test(value) {
    return (
      typeof value === 'object' &&
      !!value &&
      ((value.isRutElement === true && value.constructor.name.endsWith('Element')) ||
        (value.isRutResult === true && RESULT_NAMES.includes(value.constructor.name)))
    );
  },
};

export default serializer;
