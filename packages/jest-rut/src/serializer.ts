const serializer: jest.SnapshotSerializerPlugin = {
  print(value) {
    return value.debug({ return: true });
  },

  test(value) {
    return (
      typeof value === 'object' &&
      !!value &&
      value.isRutResult === true &&
      value.constructor.name === 'Result'
    );
  },
};

export default serializer;
