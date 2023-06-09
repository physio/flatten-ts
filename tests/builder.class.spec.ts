import { BuilderClass } from '../src/Builder.class';

describe('BuilderClass', () => {
  it('should flatten a simple object with only one level', () => {
    const obj = {
      name: 'Alice',
      age: 30,
    };
    const flattenedObj = BuilderClass.flatten(obj);
    expect(flattenedObj).toEqual({
      name: 'Alice',
      age: 30,
    });
  });

  it('should flatten an object with nested objects', () => {
    const obj = {
      name: 'Alice',
      age: 30,
      address: {
        city: 'Modena',
        state: 'IT',
      },
    };
    const flattenedObj = BuilderClass.flatten(obj);
    expect(flattenedObj).toEqual({
      name: 'Alice',
      age: 30,
      'address.city': 'Modena',
      'address.state': 'IT',
    });
  });

  it('should flatten an object with arrays', () => {
    const obj = {
      name: 'Alice',
      age: 30,
      hobbies: ['reading', 'cooking'],
    };
    const flattenedObj = BuilderClass.flatten(obj);
    expect(flattenedObj).toEqual({
      name: 'Alice',
      age: 30,
      'hobbies.0': 'reading',
      'hobbies.1': 'cooking',
    });
  });

  it('should flatten an object with nested arrays', () => {
    const obj = {
      name: 'Alice',
      age: 30,
      friends: [
        {
          name: 'Mario',
          age: 35,
        },
        {
          name: 'Paolo',
          age: 40,
        },
      ],
    };
    const flattenedObj = BuilderClass.flatten(obj);
    expect(flattenedObj).toEqual({
      name: 'Alice',
      age: 30,
      'friends.0.name': 'Mario',
      'friends.0.age': 35,
      'friends.1.name': 'Paolo',
      'friends.1.age': 40,
    });
  });

  it('should flatten an object with null and undefined values', () => {
    const obj = {
      name: 'Alice',
      age: null,
      address: {
        city: 'Modena',
        state: undefined,
      },
    };
    const flattenedObj = BuilderClass.flatten(obj);
    expect(flattenedObj).toEqual({
      name: 'Alice',
      age: null,
      'address.city': 'Modena',
    });
  });

  it('should flatten an object with empty arrays and objects', () => {
    const obj = {
      name: 'Alice',
      age: 30,
      emptyArray: [],
      emptyObject: {},
    };
    const flattenedObj = BuilderClass.flatten(obj);
    expect(flattenedObj).toEqual({
      name: 'Alice',
      age: 30,
    });
  });

  test('should flatten an object', () => {
    const obj = {
      name: 'Alice',
      age: 30,
      address: {
        city: 'Modena',
        state: 'IT',
      },
      hobbies: ['reading', 'cooking'],
      friends: [
        {
          name: 'Mario',
          age: 35,
        },
        {
          name: 'Paolo',
          age: 40,
          address: {
            city: 'Verona',
            state: 'IT',
          },
        },
      ],
    };

    const result = {
      name: 'Alice',
      age: 30,
      'address.city': 'Modena',
      'address.state': 'IT',
      'hobbies.0': 'reading',
      'hobbies.1': 'cooking',
      'friends.0.name': 'Mario',
      'friends.0.age': 35,
      'friends.1.name': 'Paolo',
      'friends.1.age': 40,
      'friends.1.address.city': 'Verona',
      'friends.1.address.state': 'IT',
    };

    expect(BuilderClass.flatten(obj)).toEqual(result);
  });

  it('should flatten an object with 10 levels of nesting', () => {
    // Create a nested object with 10 levels of nesting
    const nestedObject = {};
    let currentNode = nestedObject;
    for (let i = 0; i < 10; i++) {
      currentNode['prop'] = {};
      currentNode = currentNode['prop'];
    }
    currentNode['leaf'] = 'value';

    // Flatten the object and check the result
    const flattenedObject = BuilderClass.flatten(nestedObject);
    expect(flattenedObject).toEqual({
      'prop.prop.prop.prop.prop.prop.prop.prop.prop.prop.leaf': 'value',
    });
  });

  it('should correctly unflatten a simple object', () => {
    const flatObject = { 'name.first': 'Mario', 'name.last': 'Rossi', age: 30 };
    const expected = { name: { first: 'Mario', last: 'Rossi' }, age: 30 };

    const result = BuilderClass.unflatten(flatObject);

    expect(result).toEqual(expected);
  });

  it('should correctly unflatten an object with nested properties', () => {
    const flatObject = {
      'user.name.first': 'John',
      'user.name.last': 'Doe',
      'user.address.street': '123 Main St',
      'user.address.city': 'Anytown',
      'user.address.state': 'CA',
      'user.address.zip': '12345',
    };
    const expected = {
      user: {
        name: { first: 'John', last: 'Doe' },
        address: {
          street: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zip: '12345',
        },
      },
    };

    const result = BuilderClass.unflatten(flatObject);

    expect(result).toEqual(expected);
  });

  it('should correctly unflatten an object with empty string keys', () => {
    const flatObject = {
      '': 'empty',
      'name.first': 'John',
      'name.last': 'Doe',
    };
    const expected = { '': 'empty', name: { first: 'John', last: 'Doe' } };

    const result = BuilderClass.unflatten(flatObject);

    expect(result).toEqual(expected);
  });

  it('should correctly unflatten an object with array indexes', () => {
    const flatObject = {
      'users[0].first': 'John',
      'users[0].last': 'Doe',
      'users[1].first': 'Jane',
      'users[1].last': 'Doe',
    };
    const expected = {
      users: [
        {
          first: 'John',
          last: 'Doe',
        },
        {
          first: 'Jane',
          last: 'Doe',
        },
      ],
    };

    const result = BuilderClass.unflatten(flatObject);

    expect(result).toEqual(expected);
  });

  it('should order an array by Id', () => {
    const obj = {
      test: [
        { Id: 7, name: 'Mario' },
        { Id: 8, name: 'Paolo' },
        { Id: 6, name: 'Luca' },
        { Id: 2, name: 'Giovanni' },
        { Id: 1, name: 'Giuseppe' },
        { Id: 4, name: 'Giacomo' },
        { Id: 3, name: 'Gianluca' },
        { Id: 5, name: 'Gianmarco' },
      ],
    };
    const expected = {
      'test.0.Id': 7,
      'test.0.name': 'Mario',
      'test.1.Id': 8,
      'test.1.name': 'Paolo',
      'test.2.Id': 6,
      'test.2.name': 'Luca',
      'test.3.Id': 2,
      'test.3.name': 'Giovanni',
      'test.4.Id': 1,
      'test.4.name': 'Giuseppe',
      'test.5.Id': 4,
      'test.5.name': 'Giacomo',
      'test.6.Id': 3,
      'test.6.name': 'Gianluca',
      'test.7.Id': 5,
      'test.7.name': 'Gianmarco',
    };

    const result = BuilderClass.flatten(obj);

    expect(result).toEqual(expected);
  });
});
