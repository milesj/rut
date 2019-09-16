const serializer: jest.SnapshotSerializerPlugin = {
  print(value) {
    return value.debug({ log: false });
  },

  test(value) {
    return (
      typeof value === 'object' &&
      !!value &&
      ((value.isRutElement === true && value.constructor.name === 'Element') ||
        (value.isRutResult === true && value.constructor.name === 'Result'))
    );
  },
};

export default serializer;
