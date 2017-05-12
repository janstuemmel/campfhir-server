const Memory =  require('../../../lib/provider/memory');
const { times, get } = require('lodash');

describe('memory provider spec', () => {

  beforeEach(() => {
    Memory.resources = [];
  })


  it('should getById - exists', () => {

    // given
    Memory.add({ id: 1 });

    // when
    var e = Memory.getById(1);

    // then
    expect(e).toEqual({ id: 1 })
  });


  it('should getById - not exists', () => {

    // when
    var e = Memory.getById(1);

    // then
    expect(e).toBe(null);
  });


  it('should getById - double entries - get first', () => {

    // given
    Memory.add({ id: 1, foo: 1 });
    Memory.add({ id: 1, foo: 2 });

    // when
    var e = Memory.getById(1);

    // then
    expect(e).toEqual({ id: 1, foo: 1 });
  });


  it('should getByType', () => {

    // given
    Memory.add({ id: 1, resourceType: 'foo' });
    Memory.add({ id: 2, resourceType: 'foo' });

    // when
    var c = Memory.getByType('foo');

    // then
    expect(c).toHaveLength(2);
  });


  it('should not getByType', () => {

    // given
    Memory.add({ id: 1, resourceType: 'foo1' });
    Memory.add({ id: 2, resourceType: 'foo2' });

    // when
    var c = Memory.getByType('bar');

    // then
    expect(c).toHaveLength(0);
  });


  it('should get resources with default limit', () => {

    // given
    Memory.resources = times(100, (n) => {
      return { id: n }
    });

    // when
    const entries = Memory.get();

    // then
    expect(entries).toHaveLength(20);
  });


  it('should get resources with limit', () => {

    // given
    Memory.resources = times(100, (n) => {
      return { id: n }
    });

    // when
    const entries = Memory.get(10);

    // then
    expect(entries).toHaveLength(10);
  });


  it('should get resources with no limit', () => {

    // given
    Memory.resources = times(100, (n) => {
      return { id: n }
    });

    // when
    const entries = Memory.get(0);

    // then
    expect(entries).toHaveLength(100);
  })


  it('should filter by nested.foo and id', () => {

    // given
    Memory.add({ resourceType: 'A', id: 1, nested: { foo: 1 } });
    Memory.add({ resourceType: 'B', id: 2, nested: { foo: 1 } });
    Memory.add({ resourceType: 'A', id: 2 });

    // when
    var entries = Memory.getBy({
      'nested': (elem) => get(elem, 'nested.foo') === 1,
      'id': (elem) => get(elem, 'id') === 1,
    });

    // then
    expect(entries).toHaveLength(1);
  })


  it('should filter by nested.foo', () => {

    // given
    Memory.add({ resourceType: 'A', id: 1, nested: { foo: 1 } });
    Memory.add({ resourceType: 'B', id: 2, nested: { foo: 1 } });
    Memory.add({ resourceType: 'A', id: 2 });

    // when
    var entries = Memory.getBy({
      'nested': (elem) => get(elem, 'nested.foo') === 1,
    });

    // then
    expect(entries).toHaveLength(2);
  })


  it('should filter empty rules', () => {

    // given
    Memory.add({ resourceType: 'A', id: 1, nested: { foo: 1 } });
    Memory.add({ resourceType: 'B', id: 2, nested: { foo: 1 } });
    Memory.add({ resourceType: 'A', id: 2 });

    // when
    var entries = Memory.getBy();

    // then
    expect(entries).toHaveLength(3);
  })
})
