// utilities and definitions

const Category = {
    'language' : 'language',
    'fp' : 'functional programming',
};

let topics = {};

const defineSource = (title, href) => ({
  'title' : title,
  'href'  : href,
});

const defineTopic = (name, description_, sources_, category_, requires_) => {
  const id          = name.toLowerCase().replace(/[^a-z]+/g, '-');
  const description = description_||'';
  const sources     = sources_||[];
  const category    = category_||Category.language;
  const requires    = requires_||[];
  const level       = ((requires.length > 0) ? Math.max.apply(Math, requires.map(parentId => topics[parentId].level)) : 0) + 1;
  const topic = {
      'id'          : id,
      'name'        : name,
      'description' : description,
      'sources'     : sources,
      'category'    : category,
      'requires'    : requires,
      // for vis.js
      'label'       : name,
      'group'       : category,
      'level'       : level,
  };
  topics[id] = topic;
  return id;
};

// topics

const parametricTypes = defineTopic(
  'Parametric Types',
  `Known in Java as Generic Types and in C++ as Class Templates.
  Types which has to be parametrized with another type in order to create an instantiable type,
  e.g. <code>List</code>, <code>Option</code>, <code>Function</code>, <code>IO</code>.`,
  [
    defineSource('Generic Classes | Tour of Scala', 'https://docs.scala-lang.org/tour/generic-classes.html'),
  ],
  Category.language,
  []
);

const implicits = defineTopic(
  'Implicits',
  `Mechanism of finding and passing arguments into functions and methods by the compiler, based on their type.`,
  [
    defineSource('Implicit Parameters | Tour of Scala', 'https://docs.scala-lang.org/tour/implicit-parameters.html'),
  ],
  Category.language,
  []
);

const typeClasses = defineTopic(
  'Type Classes',
  `A way of defining some interface and letting our type use it, which doesn't require us to modify the type to extend some <code>trait</code>/<code>class</code>.`,
  [
    defineSource('Type classes (Cats documentation)', 'https://typelevel.org/cats/typeclasses.html'),
    defineSource('Type classes in Scala - Ad-hoc polymorphism (Scalac blog)', 'https://scalac.io/blog/typeclasses-in-scala/'),
  ],
  Category.fp,
  [
    parametricTypes,
    implicits,
  ]
);

const lifting = defineTopic(
  'Lifting',
  `In mathematics a practice of converting value into some intermediate type which is for some reason convenient to us.
  <br><br>
  Working is done mostly on this intermediate type before converting it into the target type.
  <br><br>
  In practice programmers use this name for converting raw values into values in some wrapper e.g. putting <code>Int</code> into <code>Option[Int]</code>,
  <code>String</code> into successful <code>Future[String]</code>, etc.`,
  [],
  Category.fp,
  []
);

const algebra = defineTopic(
  'Algebra',
  `A set of values together with operations closed under it (functions taking and returning values only from this set),
  e.g. real numbers with +, -, *, /, square matrices of certain dimension with addition and multiplication of these matrices, etc.`,
  [],
  Category.fp,
  []
);

const semigroup = defineTopic(
  'Semigroup',
  `A set of values that you can combine together where order of combinations might matter but grouping (parenthesis) doesn't (associative operation):
  (A + B) + C = A + (B + C), e.g. <code>String</code> concatenation, number additions.`,
  [],
  Category.fp,
  [
    algebra,
  ]
);

const monoid = defineTopic(
  'Monoid',
  `A semigroup which has some neutral element (aka idenity) that is a value which you can "add" do another value without changing it,
  e.g. <code>String</code> concatenation with an empty <code>String</code>.`,
  [],
  Category.fp,
  [
    semigroup,
  ]
);

const functor = defineTopic(
  'Functor',
  `A way of saying that if you represented one thing as a directed multigraph, and another things as a directed multigraph,
  then the former could be a subgraph of another, so you could always safely map relations in the former into relations in the latter.
  Requires that the relations "combine" that is, if there is some relation A -> B and B -> C in one graph, then there has to be a relation
  A -> C which can be assumed to be a combination of these two.
  <br><br>
  E.g. if your graph's nodes would be types and edges would be functions from one type into the other, a functor would provide a mapping from
  functions in one set into another: <code>List</code> functor would translate <code>Int => String</code> into <code>List[Int] => List[String]</code>.
  Usually, we convert the function and apply the value in one step with <code>fa.map(aToB)</code>.
  <br><br>
  If nodes represented types but edges represented subtyping relation, then functor would tell us that if there is subtyping relation between the types,
  then then the types created by passing these types into some parametric type have to be subtypes as well. Since functor is also known as <b>covariant
  functor</b>, this explains covariance in Scala: <code>List[X]</code> is covariant in <code>X</code> type parameter so if <code>A <: B</code> then <code>List[A] <: List[B]</code>.
  <br><br>
  Good intuition is treating such functors as producers. If you have a producer of values <code>A</code> then you can "append" function <code>A => B</code>
  to create a producer of <code>B</code>. Also if you have a producer of <code>B</code> and <code>A <: B</code> then producer can be safely upcasted to producer of <code>A</code>.`,
  [],
  Category.fp,
  [
    lifting,
    parametricTypes,
  ]
);

const contravariant = defineTopic(
  'Contravariant Functor',
  `Kind of a functor but the target directed multigraph has arrows reversed.
  <br><br>
  E.g. with nodes being types and edges functions models, then convariant functor turns e.g. <code>Int => String</code> into <code>Subscriber[String] => Subscriber[Int]</code>.
  <br><br>
  With nodes being types and edges subtyping, we get things like <code>A <: B</code> implying that <code>Subscriber[B] <: Subscriber[A]</code> - meaing that <code>Subscriber[X]</code>
  is covariant in <code>X</code>. Usually, we convert the function and apply value with <code>fb.contramap(aToB)</code>.
  <br><br>
  Good intuition is to treat such covariant functors as consumers. If you have a consumer of values <code>B</code> then you can "prepend" function <code>A => B</code>
  to make a consumer of <code>A</code>. ALso if you have a consumer of <code>B</code> and <code>A <: B</code> then consumer can be safely upcasted to consumer of <code>A</code>.`,
  [],
  Category.fp,
  [
    functor,
  ]
);

const applicative = defineTopic(
  'Applicative Functor',
  `If functor help us model producers and "append" new operations at the output, applicative functors let us combine outputs of 2 producers with <code>fa.map2(fb) { (a,b) => c}</code>.
  <br><br>
  Another way of thinking about them is as an ability to create a Cartesian product of all values produced by 2 producers to create a producer of tuples (<code>(fa, fb).tupled</code>).
  Since applicative functor is still a functor you can <code>map</code> these tuples which can be done (for 2 or more producers) in one step using <code>(fa, fb, fc).mapN { (a,b,c) => d }</code>.`,
  [],
  Category.fp,
  [
    functor,
  ]
);

const monad = defineTopic(
  'Monad',
  `Basically a functor with an ability to <code>flatten</code>.
  <br><br>
  Functor is a producer where we can "append" function on the output. But this function is always takes 1 value and returns 1 value. We have no way of returning 0 or more than 1 values.
  However, if we have e.g. a <code>List</code> we could map it to another <code>List</code> - we could control how many elements will be produced from a single input value.
  Then, <code>flatten</code> would take care about merging <code>List</code>s together. Same principle applies to producers which aren't containers, but might model async or failable
  computations. By manually creating the producer out of value, we might decide to interupt the streak of successful computations. (Recovery would not be a part of the interface of monads).
  <br><br>
  Usually, we combine <code>map</code> and <code>flatten</code> into a single operation: <code>flatMap</code>. 
  <br><br>
  We require that for each monad has some "stupid" wrapping utility, which simply take a value a create a single-value producer out of it with no extra logic.
  This way <code>flatMap(wrap)</code> is a noop. We also want this producer's flattening be associative.
  <br><br>
  Every monad is applicative functor because <code>flatMap</code> allows implementation of applicative interfaces. It's worth remembering though that while applicative interface
  isn't enforcing any order of evaluations, monadic interface does, making all applicative operations on monad sequential.`,
  [],
  Category.fp,
  [
    applicative,
  ]
);

const freeAlgebra = defineTopic(
  'Free Algebra',
  `Generator of algebras of sort where you provide a set of values and it will return an algebra of certain type,
  e.g. free monoid will take your set of values and return something that is a monoid (you can concatenate its values and there is some empty/neutral/identity value).
  Values of the old set have to be lifted before you can start working with them.
  <br><br>
  Since free algebras are usually just a data structure recording operations, you can later on provide an actual operations and replay them on elements.
  E.g. free semigroup of A, would allow you adding some A wrappers together, and later on - when you provide an associative operations under A
  - to calculate the result under A.`,
  [],
  Category.fp,
  [
    lifting,
    algebra,
  ]
);

const freeMonoid = defineTopic(
  'Free Monoid',
  `Free algebra that generates monoid.
  <br><br>
  Virtually equal to <code>List</code>: when you give it <code>String</code>, you have a <code>List[String]</code>,
  when you give it <code>Int</code> you have a <code>List[Int]</code>.
  Lists can be concatenated, order of concatenations matters, their grouping doesn't - <code>(a ++ b) ++ c = a ++ (b ++ c)</code>.
  Empty <code>List</code> doesn't affect the result of concatenation.
  Therefore <code>List</code> of <code>X</code> is a monoid. When you provide an operation combining <code>List</code>s elemets you can fold it into the single element as if you combined them directly.`,
  [],
  Category.fp,
  [
    monoid,
    freeAlgebra,
  ]
);

const freeMonad = defineTopic(
  'Free Monad',
  `Generator which takes a functor and returns wrapper which adds to it an ability to flatten values and wrap pure (non-functor) values.
  <br><br>
  Usually used with a functor representing some set of domain operations, interpreter running these operations into some side-effecting type,
  and side-effecting type being a monad in order to replay the order of operations and all the logic.`,
  [],
  Category.fp,
  [
    monad,
    freeAlgebra,
  ]
);